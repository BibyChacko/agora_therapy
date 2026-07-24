import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { verifyRequestUser } from "@/lib/server/firebase-request-auth";
import { AvailableSlotsService } from "@/lib/services/available-slots-service";
import { googleMeetService } from "@/lib/services/google-meet-service";
import { PricingService } from "@/lib/services/pricing-service";
import { tamaraService } from "@/lib/services/tamara-service";
import {
  getTherapySessionConfig,
  normalizeTherapySessionType,
} from "@/lib/session/therapy-session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyRequestUser(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminFirestore();
    const clientId = decodedToken.uid;

    // Get client user data
    const clientDoc = await db.collection("users").doc(clientId).get();
    const clientData = clientDoc.data();

    if (!clientData) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      therapistId,
      timeSlotId,
      scheduledFor, // ISO string
      duration,
      sessionType = "single",
      clientNotes,
      paymentProvider = "stripe",
    } = body;

    // Validate required fields
    if (!therapistId || !scheduledFor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedSessionType = normalizeTherapySessionType(sessionType);
    const sessionConfig = getTherapySessionConfig(normalizedSessionType);
    const sessionDuration = duration || sessionConfig.duration;
    const googleMeetStatus = await googleMeetService.getConnectionStatus();

    if (!googleMeetStatus.connected) {
      return NextResponse.json(
        {
          error:
            "Bookings are temporarily unavailable because Google Meet is not connected yet. Please connect the Google Meet host account in admin settings first.",
        },
        { status: 503 }
      );
    }

    if (timeSlotId) {
      const availability = await AvailableSlotsService.checkSlotAvailability(
        therapistId,
        timeSlotId,
        new Date(scheduledFor)
      );

      if (!availability.available) {
        return NextResponse.json(
          { error: availability.reason || "Selected time slot is no longer available" },
          { status: 409 }
        );
      }
    }

    // Get therapist data
    const therapistProfileDoc = await db
      .collection("therapistProfiles")
      .doc(therapistId)
      .get();

    if (!therapistProfileDoc.exists) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    const therapistProfile = therapistProfileDoc.data();
    if (!therapistProfile?.verification?.isVerified) {
      return NextResponse.json(
        { error: "Therapist is not verified" },
        { status: 400 }
      );
    }

    // Prepare customer shipping information (required for Indian regulations)
    const customerName = clientData.profile?.displayName || 
                        `${clientData.profile?.firstName || ''} ${clientData.profile?.lastName || ''}`.trim() || 
                        'Customer';

    const appointmentRef = db.collection("appointments").doc();
    const address = clientData.profile?.address || {};
    const countryCode = String(address.country || "AE").toUpperCase();
    const phoneNumber =
      clientData.profile?.phone ||
      clientData.profile?.phoneNumber ||
      clientData.phoneNumber ||
      "";
    const firstName = clientData.profile?.firstName || customerName.split(" ")[0] || "Client";
    const lastName =
      clientData.profile?.lastName ||
      customerName.split(" ").slice(1).join(" ") ||
      "User";

    const pricing = await PricingService.calculateBookingPricing({
      request,
      therapistProfile,
      profileCountryCode: countryCode,
      sessionDurationMinutes: sessionDuration,
    });

    const therapistFee = pricing.therapistFee.amountMinor;
    const platformFee = pricing.platformFee.amountMinor;
    const totalAmount = pricing.total.amountMinor;
    const currency = pricing.total.currency;

    const tamaraPricing =
      paymentProvider === "tamara"
        ? tamaraService.getCheckoutPricing({
            countryCode,
            totalAmount,
            therapistFee,
            platformFee,
            currency,
          })
        : null;

    if (paymentProvider === "tamara") {
      if (!tamaraService.isEnabled()) {
        return NextResponse.json(
          { error: "Tamara is not configured yet." },
          { status: 503 }
        );
      }

      if (!clientData.email || !phoneNumber) {
        return NextResponse.json(
          {
            error:
              "Tamara checkout requires a client email address and phone number on file.",
          },
          { status: 400 }
        );
      }

      const unsupportedMessage = tamaraService.getUnsupportedCountryCurrencyMessage(
        countryCode,
        tamaraPricing?.totalAmount.currency || currency
      );

      if (unsupportedMessage) {
        return NextResponse.json({ error: unsupportedMessage }, { status: 400 });
      }
    }

    // Create appointment document (pending payment)
    const appointmentData = {
      id: appointmentRef.id,
      therapistId,
      clientId,
      scheduledFor: new Date(scheduledFor),
      timeSlotId: timeSlotId || "",
      duration: sessionDuration,
      status: "pending",
      session: {
        type: normalizedSessionType,
        deliveryType: "video",
        platform: "google_meet",
        maxClientParticipants: sessionConfig.clientParticipants,
        totalParticipantLimit: sessionConfig.totalParticipants,
      },
      payment: {
        amount: totalAmount,
        therapistFee,
        platformFee,
        currency,
        status: "pending",
        transactionId: "",
        method: paymentProvider,
        baseAmount: pricing.usdReference.totalMinor,
        baseCurrency: "USD",
        exchangeRate: pricing.exchangeRate,
        rateDate: pricing.rateDate,
        countryCode: pricing.context.countryCode,
        pricingRuleType: pricing.appliedRule.type,
        pricingRuleDescription: pricing.appliedRule.description,
        ...(tamaraPricing
          ? {
              originalAmount: pricing.usdReference.totalMinor,
              originalCurrency: tamaraPricing.originalCurrency,
              exchangeRate: tamaraPricing.exchangeRate ?? null,
            }
          : {}),
      },
      communication: {
        clientNotes: clientNotes || "",
        therapistNotes: "",
        internalNotes: "",
        remindersSent: {
          email: [],
          sms: [],
        },
      },
      metadata: {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    };

    await appointmentRef.set(appointmentData);

    if (paymentProvider === "tamara") {
      try {
        const checkoutSession = await tamaraService.createCheckoutSession({
          appointmentId: appointmentRef.id,
          totalAmount: tamaraPricing!.totalAmount,
          shippingAmount: { amount: 0, currency: tamaraPricing!.totalAmount.currency },
          taxAmount: { amount: 0, currency: tamaraPricing!.totalAmount.currency },
          consumer: {
            firstName,
            lastName,
            phoneNumber,
            email: clientData.email,
          },
          billingAddress: {
            firstName,
            lastName,
            line1: address.line1 || "Address not provided",
            line2: address.line2 || "-",
            city: address.city || "Dubai",
            region: address.state || address.region || "Dubai",
            countryCode,
            phoneNumber,
          },
          shippingAddress: {
            firstName,
            lastName,
            line1: address.line1 || "Address not provided",
            line2: address.line2 || "-",
            city: address.city || "Dubai",
            region: address.state || address.region || "Dubai",
            countryCode,
            phoneNumber,
          },
          item: {
            name: `${sessionConfig.label} with ${therapistProfile.profile?.displayName || therapistId}`,
            referenceId: appointmentRef.id,
            sku: `therapy-${normalizedSessionType}`,
            itemUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/booking/${therapistId}`,
            imageUrl: therapistProfile.profileImage || therapistProfile.profile?.photoURL,
            totalAmount: tamaraPricing!.totalAmount,
            unitPrice: tamaraPricing!.totalAmount,
            taxAmount: { amount: 0, currency: tamaraPricing!.totalAmount.currency },
          },
          description: `${sessionConfig.label} therapy session`,
        });

        await appointmentRef.update({
          "payment.amount": tamaraPricing!.totalAmount.amount,
          "payment.currency": tamaraPricing!.totalAmount.currency,
          "payment.baseAmount": pricing.usdReference.totalMinor,
          "payment.baseCurrency": "USD",
          ...(tamaraPricing?.therapistFee
            ? { "payment.therapistFee": tamaraPricing.therapistFee.amount }
            : {}),
          ...(tamaraPricing?.platformFee
            ? { "payment.platformFee": tamaraPricing.platformFee.amount }
            : {}),
          "payment.transactionId": checkoutSession.order_id,
          "payment.providerCheckoutId": checkoutSession.checkout_id,
          "payment.providerStatus": checkoutSession.status,
        });

        return NextResponse.json({
          appointmentId: appointmentRef.id,
          amount: tamaraPricing!.totalAmount.amount,
          therapistFee: tamaraPricing?.therapistFee?.amount ?? therapistFee,
          platformFee: tamaraPricing?.platformFee?.amount ?? platformFee,
          currency: tamaraPricing!.totalAmount.currency,
          paymentProvider: "tamara",
          checkoutUrl: checkoutSession.checkout_url,
        });
      } catch (error) {
        await appointmentRef.delete();

        const message =
          error instanceof Error
            ? error.message
            : "Failed to create Tamara checkout session";

        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      description: `${sessionConfig.label} - ${sessionDuration} minutes`,
      statement_descriptor_suffix: "MINDGOOD",
      receipt_email: clientData.email,
      shipping: {
        name: customerName,
        address: {
          line1: address.line1 || 'Address not provided',
          line2: address.line2 || null,
          city: address.city || 'City not provided',
          state: address.state || null,
          postal_code: address.postalCode || '00000',
          country: countryCode,
        },
      },
      metadata: {
        appointmentId: appointmentRef.id,
        therapistId,
        clientId,
        clientName: customerName,
        clientEmail: clientData.email,
        clientCountryCode: pricing.context.countryCode || "",
        baseCurrency: "USD",
        baseAmount: pricing.usdReference.totalMinor.toString(),
        exchangeRate: pricing.exchangeRate?.toString() || "",
        scheduledFor,
        duration: sessionDuration.toString(),
        sessionType: normalizedSessionType,
        maxClientParticipants: sessionConfig.clientParticipants.toString(),
        service: "Online Therapy Session",
        company: "Nextauras Global Services LLC FZ",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await appointmentRef.update({
      "payment.transactionId": paymentIntent.id,
    });

    return NextResponse.json({
      appointmentId: appointmentRef.id,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
      therapistFee,
      platformFee,
      currency: currency.toLowerCase(),
      pricing: {
        countryCode: pricing.context.countryCode,
        baseCurrency: "USD",
        baseAmount: pricing.usdReference.totalMinor,
        exchangeRate: pricing.exchangeRate,
        rateDate: pricing.rateDate,
        ruleType: pricing.appliedRule.type,
        ruleDescription: pricing.appliedRule.description,
      },
      paymentProvider: "stripe",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
