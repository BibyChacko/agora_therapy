import { NextRequest, NextResponse } from "next/server";

import { finalizeAppointmentPayment } from "@/lib/services/appointment-payment-service";
import { tamaraService, type TamaraWebhookPayload } from "@/lib/services/tamara-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const queryToken = request.nextUrl.searchParams.get("tamaraToken");
    const authHeader = request.headers.get("authorization");

    tamaraService.verifyWebhookToken({ authHeader, queryToken });

    const payload = (await request.json()) as TamaraWebhookPayload;
    console.log("Tamara webhook received", payload);

    if (!payload.order_reference_id || !payload.order_id || !payload.event_type) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    if (payload.event_type === "order_approved") {
      await tamaraService.authoriseOrder(payload.order_id);
      await finalizeAppointmentPayment({
        appointmentId: payload.order_reference_id,
        paymentMethod: "tamara",
        providerTransactionId: payload.order_id,
        providerStatus: payload.event_type,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Tamara webhook error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process Tamara webhook",
      },
      { status: 500 }
    );
  }
}
