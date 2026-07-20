import { NextRequest, NextResponse } from "next/server";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyRequestUser } from "@/lib/server/firebase-request-auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const decodedToken = await verifyRequestUser(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId } = await context.params;
    const appointmentDoc = await getAdminFirestore()
      .collection("appointments")
      .doc(appointmentId)
      .get();

    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const appointment = appointmentDoc.data()!;
    if (
      appointment.clientId !== decodedToken.uid &&
      appointment.therapistId !== decodedToken.uid
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      appointmentId,
      status: appointment.status,
      paymentStatus: appointment.payment?.status || null,
      paymentMethod: appointment.payment?.method || null,
      providerJoinUrl: appointment.session?.providerJoinUrl || null,
      joinUrl: appointment.session?.joinUrl || null,
      meetingId: appointment.session?.meetingId || null,
    });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking status" },
      { status: 500 }
    );
  }
}
