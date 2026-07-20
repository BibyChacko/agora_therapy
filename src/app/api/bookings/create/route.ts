import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { verifyRequestUser } from "@/lib/server/firebase-request-auth";
import { AvailableSlotsService } from "@/lib/services/available-slots-service";
import { googleMeetService } from "@/lib/services/google-meet-service";
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

    // Get therapist hourly rate
    let hourlyRate = therapistProfile.practice?.hourlyRate || 5000; // Default $50
    if (hourlyRate < 1000) {
      // Convert dollars to cents if needed
      hourlyRate = hourlyRate * 100;
    }

    // Calculate amounts
    const therapistFee = Math.round((hourlyRate * sessionDuration) / 60);
    const platformFee = 1500; // $15.00 in cents
    const totalAmount = therapistFee + platformFee;

    // Prepare customer shipping information (required for Indian regulations)
    const customerName = clientData.profile?.displayName || 
                        `${clientData.profile?.firstName || ''} ${clientData.profile?.lastName || ''}`.trim() || 
                        'Customer';
    
    const appointmentRef = db.collection("appointments").doc();

    // Create Stripe PaymentIntent with customer details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: therapistProfile.practice?.currency || "aed",
      description: `${sessionConfig.label} - ${sessionDuration} minutes`,
      statement_descriptor_suffix: "MINDGOOD",
      receipt_email: clientData.email,
      shipping: {
        name: customerName,
        address: {
          line1: clientData.profile?.address?.line1 || 'Address not provided',
          line2: clientData.profile?.address?.line2 || null,
          city: clientData.profile?.address?.city || 'City not provided',
          state: clientData.profile?.address?.state || null,
          postal_code: clientData.profile?.address?.postalCode || '00000',
          country: clientData.profile?.address?.country || 'AE',
        },
      },
      metadata: {
        appointmentId: appointmentRef.id,
        therapistId,
        clientId,
        clientName: customerName,
        clientEmail: clientData.email,
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
        currency: therapistProfile.practice?.currency || "aed",
        status: "pending",
        transactionId: paymentIntent.id,
        method: "stripe",
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

    return NextResponse.json({
      appointmentId: appointmentRef.id,
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
      therapistFee,
      platformFee,
      currency: therapistProfile.practice?.currency || "aed",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
