import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";
import { emailService } from "@/lib/services/email-service";
import { RtcTokenBuilder, RtcRole } from "agora-token";
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

// Agora configuration
const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

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

    const sessionConfig = getTherapySessionConfig(
      normalizeTherapySessionType(appointmentData.session?.type)
    );

    // Generate Agora channel and tokens
    const channelName = `session_${appointmentDoc.id}`;
    const meetingId = appointmentDoc.id;
    const meetingPasscode = generateMeetingPasscode();
    const expirationTime = Math.floor(Date.now() / 1000) + 24 * 3600; // 24 hours

    // Generate tokens for both client and therapist
    const clientUid = parseInt(appointmentData.clientId.substring(0, 8), 36);
    const therapistUid = parseInt(appointmentData.therapistId.substring(0, 8), 36);

    const clientToken = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      clientUid,
      RtcRole.PUBLISHER,
      expirationTime,
      expirationTime
    );

    const therapistToken = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      therapistUid,
      RtcRole.PUBLISHER,
      expirationTime,
      expirationTime
    );

    // Generate meeting link
    const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/session/${appointmentDoc.id}`;

    // Update appointment with session details
    await appointmentDoc.ref.update({
      status: "confirmed",
      "payment.status": "paid",
      "payment.paidAt": FieldValue.serverTimestamp(),
      "session.channelId": channelName,
      "session.joinUrl": meetingLink,
      "session.meetingId": meetingId,
      "session.meetingPasscode": meetingPasscode,
      "session.maxClientParticipants":
        appointmentData.session?.maxClientParticipants ||
        sessionConfig.clientParticipants,
      "session.totalParticipantLimit":
        appointmentData.session?.totalParticipantLimit ||
        sessionConfig.totalParticipants,
      "metadata.confirmedAt": FieldValue.serverTimestamp(),
      "metadata.updatedAt": FieldValue.serverTimestamp(),
    });

    // Store tokens separately for security (not in main appointment doc)
    await db
      .collection("sessionCredentials")
      .doc(appointmentDoc.id)
      .set({
        appointmentId: appointmentDoc.id,
        meetingId,
        meetingPasscode,
        channelName,
        clientToken,
        therapistToken,
        clientUid,
        therapistUid,
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
        appId: AGORA_APP_ID,
        expiresAt: new Date(expirationTime * 1000),
        createdAt: FieldValue.serverTimestamp(),
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
