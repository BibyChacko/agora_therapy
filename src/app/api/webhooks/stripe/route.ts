import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";
import Stripe from "stripe";
import { finalizeAppointmentPayment } from "@/lib/services/appointment-payment-service";

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
    await finalizeAppointmentPayment({
      appointmentId: appointmentDoc.id,
      paymentMethod: "stripe",
      providerTransactionId: paymentIntent.id,
      providerStatus: paymentIntent.status,
    });

    console.log("Payment processed successfully for appointment:", appointmentDoc.id);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}
