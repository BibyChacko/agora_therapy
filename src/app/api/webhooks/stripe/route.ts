import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { emailService } from "@/lib/services/email-service";
import { googleMeetService } from "@/lib/services/google-meet-service";
import {
  generateMeetingPasscode,
  getTherapySessionConfig,
  normalizeTherapySessionType,
} from "@/lib/session/therapy-session";

// Disable body parsing for Stripe webhooks
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const webhookSecrets = [
  process.env.STRIPE_WEBHOOK_SECRET,
  ...(process.env.STRIPE_WEBHOOK_SECRETS || "")
    .split(",")
    .map((secret) => secret.trim())
    .filter(Boolean),
].filter((secret): secret is string => Boolean(secret));

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Stripe webhook received");
    const payload = Buffer.from(await request.arrayBuffer());
    const signature = request.headers.get("stripe-signature");

    console.log("📝 Request details:");
    console.log("- Request path:", request.nextUrl.pathname);
    console.log("- Body length:", payload.length);
    console.log("- Has signature:", !!signature);
    console.log("- Webhook secrets configured:", webhookSecrets.length);

    if (!signature) {
      console.error("❌ Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (webhookSecrets.length === 0) {
      console.error("❌ No Stripe webhook secret configured");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature against each configured secret
    let event: Stripe.Event;
    try {
      let verifiedEvent: Stripe.Event | null = null;

      for (const webhookSecret of webhookSecrets) {
        try {
          verifiedEvent = stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
          );
          break;
        } catch {
          // Keep trying configured secrets until one matches.
        }
      }

      if (!verifiedEvent) {
        throw new Error(
          "No configured Stripe webhook secret matched the request signature."
        );
      }

      event = verifiedEvent;
      console.log("✅ Webhook signature verified");
      console.log("📦 Event type:", event.type);
    } catch (err) {
      const error = err as Error;
      console.error("❌ Webhook signature verification failed:", error.message);
      console.error("Full error:", error);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSuccess(paymentIntent);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const db = getAdminFirestore();

  try {
    console.log("Handling successful Stripe payment intent", {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });

    // Find appointment by payment intent ID
    const appointmentsSnapshot = await db
      .collection("appointments")
      .where("payment.transactionId", "==", paymentIntent.id)
      .limit(1)
      .get();

    if (appointmentsSnapshot.empty) {
      console.error("No appointment found for payment intent:", paymentIntent.id);
      return;
    }

    const appointmentDoc = appointmentsSnapshot.docs[0];
    const appointmentData = appointmentDoc.data();
    console.log("Matched payment intent to appointment", {
      appointmentId: appointmentDoc.id,
      appointmentStatus: appointmentData.status,
      paymentStatus: appointmentData.payment?.status,
      therapistId: appointmentData.therapistId,
      clientId: appointmentData.clientId,
      scheduledFor:
        appointmentData.scheduledFor?.toDate?.()?.toISOString?.() || null,
    });
    const existingStatus = appointmentData.status;
    const existingPaymentStatus = appointmentData.payment?.status;

    if (
      existingPaymentStatus === "paid" &&
      ["confirmed", "in_progress", "completed"].includes(existingStatus)
    ) {
      console.log(
        "Payment webhook already processed for appointment:",
        appointmentDoc.id
      );
      return;
    }

    const sessionConfig = getTherapySessionConfig(
      normalizeTherapySessionType(appointmentData.session?.type)
    );

    const meetingPasscode = generateMeetingPasscode();
    // Keep the app session page as the verified entry point, then launch Meet from there.
    const meetingLink = googleMeetService.getSessionLandingUrl(appointmentDoc.id);
    console.log("Preparing session link data", {
      appointmentId: appointmentDoc.id,
      sessionLandingUrl: meetingLink,
      generatedMeetingPasscode: meetingPasscode,
    });
    let meetingId = appointmentDoc.id;
    let providerJoinUrl: string | null = null;
    let providerSpaceName: string | null = null;
    let sessionProvisioningWarning: string | null = null;

    try {
      console.log("Attempting Google Meet provisioning", {
        appointmentId: appointmentDoc.id,
      });
      const meetingSpace = await googleMeetService.createMeetingSpace();
      meetingId = meetingSpace.meetingCode;
      providerJoinUrl = meetingSpace.meetingUri;
      providerSpaceName = meetingSpace.spaceName;
      console.log("Google Meet provisioning succeeded", {
        appointmentId: appointmentDoc.id,
        meetingId,
        providerJoinUrl,
        providerSpaceName,
      });
    } catch (meetingError) {
      sessionProvisioningWarning =
        meetingError instanceof Error
          ? meetingError.message
          : "Google Meet session could not be provisioned automatically.";

      console.error(
        "Google Meet provisioning failed for appointment:",
        appointmentDoc.id,
        sessionProvisioningWarning
      );
    }

    // Update appointment with session details
    console.log("Persisting session details to appointment", {
      appointmentId: appointmentDoc.id,
      meetingId,
      providerJoinUrl,
      providerSpaceName,
      sessionProvisioningWarning,
    });
    await appointmentDoc.ref.update({
      status: "confirmed",
      "payment.status": "paid",
      "payment.paidAt": FieldValue.serverTimestamp(),
      "session.platform": "google_meet",
      "session.joinUrl": meetingLink,
      "session.providerJoinUrl": providerJoinUrl,
      "session.providerSpaceName": providerSpaceName,
      "session.meetingId": meetingId,
      "session.meetingPasscode": meetingPasscode,
      "session.maxClientParticipants":
        appointmentData.session?.maxClientParticipants ||
        sessionConfig.clientParticipants,
      "session.totalParticipantLimit":
        appointmentData.session?.totalParticipantLimit ||
        sessionConfig.totalParticipants,
      "communication.internalNotes": sessionProvisioningWarning
        ? `Auto-generated after payment: ${sessionProvisioningWarning}`
        : appointmentData.communication?.internalNotes || "",
      "metadata.confirmedAt": FieldValue.serverTimestamp(),
      "metadata.updatedAt": FieldValue.serverTimestamp(),
    });

    // Store only the external meeting metadata needed by the app.
    await db
      .collection("sessionCredentials")
      .doc(appointmentDoc.id)
      .set({
        appointmentId: appointmentDoc.id,
        meetingId,
        meetingPasscode,
        provider: "google_meet",
        providerJoinUrl,
        providerSpaceName,
        maxClientParticipants:
          appointmentData.session?.maxClientParticipants ||
          sessionConfig.clientParticipants,
        totalParticipantLimit:
          appointmentData.session?.totalParticipantLimit ||
          sessionConfig.totalParticipants,
        participantIds: [
          `client:${appointmentData.clientId}`,
          `therapist:${appointmentData.therapistId}`,
        ],
        createdAt: FieldValue.serverTimestamp(),
      });
    console.log("Stored session credentials document", {
      appointmentId: appointmentDoc.id,
      meetingId,
      providerJoinUrl,
    });

    // Get client and therapist details
    const [clientDoc, therapistDoc, therapistProfileDoc] = await Promise.all([
      db.collection("users").doc(appointmentData.clientId).get(),
      db.collection("users").doc(appointmentData.therapistId).get(),
      db.collection("therapistProfiles").doc(appointmentData.therapistId).get(),
    ]);

    const clientData = clientDoc.data();
    const therapistData = therapistDoc.data();
    const therapistProfileData = therapistProfileDoc.data();

    // Send confirmation emails
    console.log("📧 Preparing to send confirmation emails...");
    console.log("Client Email:", clientData?.email);
    console.log("Therapist Email:", therapistData?.email);
    console.log("Meeting Link:", meetingLink);
    console.log("🔍 ENV Check - SMTP_HOST:", process.env.SMTP_HOST);
    console.log("🔍 ENV Check - SMTP_USER:", process.env.SMTP_USER);
    console.log("🔍 ENV Check - Has SMTP_PASSWORD:", !!process.env.SMTP_PASSWORD);
    
    try {
      await emailService.sendAppointmentConfirmation({
        clientName: clientData?.profile?.displayName || "Client",
        clientEmail: clientData?.email || "",
        therapistName: therapistData?.profile?.displayName || "Therapist",
        therapistEmail: therapistData?.email || "",
        appointmentDate: appointmentData.scheduledFor.toDate(),
        duration: appointmentData.duration,
        meetingLink,
        meetingId,
        meetingPasscode,
        sessionTypeLabel: sessionConfig.label,
        maxClientParticipants:
          appointmentData.session?.maxClientParticipants ||
          sessionConfig.clientParticipants,
        amount: appointmentData.payment.amount,
        currency: appointmentData.payment.currency,
      });
      console.log("✅ Confirmation emails sent successfully!");
      if (sessionProvisioningWarning) {
        console.warn(
          "Confirmation email sent without a provider Google Meet link. Session provisioning still needs attention for appointment:",
          appointmentDoc.id
        );
      }
    } catch (emailError) {
      console.error("❌ Failed to send confirmation emails:", emailError);
      // Don't throw - we still want to mark payment as successful
    }

    console.log("Payment processed successfully for appointment:", appointmentDoc.id);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}
