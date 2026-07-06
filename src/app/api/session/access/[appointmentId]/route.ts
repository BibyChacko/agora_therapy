import { NextRequest, NextResponse } from "next/server";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyRequestUser } from "@/lib/server/firebase-request-auth";
import {
  getTherapySessionConfig,
  normalizeTherapySessionType,
} from "@/lib/session/therapy-session";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await context.params;
    const { meetingPasscode } = (await request.json()) as {
      meetingPasscode?: string;
    };

    const db = getAdminFirestore();
    const appointmentDoc = await db.collection("appointments").doc(appointmentId).get();

    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const appointment = appointmentDoc.data();
    const verifiedUser = await verifyRequestUser(request);
    const sessionType = normalizeTherapySessionType(appointment?.session?.type);
    const sessionConfig = getTherapySessionConfig(sessionType);

    let viewerRole: "therapist" | "client" | "guest" | null = null;

    if (verifiedUser && verifiedUser.uid === appointment?.therapistId) {
      const therapistDoc = await db.collection("users").doc(verifiedUser.uid).get();
      if (therapistDoc.data()?.role !== "therapist") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      viewerRole = "therapist";
    } else if (verifiedUser && verifiedUser.uid === appointment?.clientId) {
      viewerRole = "client";
    } else if (meetingPasscode && meetingPasscode === appointment?.session?.meetingPasscode) {
      viewerRole = "guest";
    }

    if (!viewerRole) {
      return NextResponse.json(
        { error: "Meeting credentials are invalid." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      appointment: {
        id: appointmentId,
        scheduledFor: appointment?.scheduledFor?.toDate?.()?.toISOString?.() || null,
        duration: appointment?.duration || sessionConfig.duration,
        status: appointment?.status,
        therapistId: appointment?.therapistId,
        clientId: appointment?.clientId,
        session: {
          type: sessionType,
          joinUrl: appointment?.session?.joinUrl || null,
          meetingId: appointment?.session?.meetingId || appointmentId,
          maxClientParticipants:
            appointment?.session?.maxClientParticipants ||
            sessionConfig.clientParticipants,
          totalParticipantLimit:
            appointment?.session?.totalParticipantLimit ||
            sessionConfig.totalParticipants,
        },
      },
      viewerRole,
    });
  } catch (error) {
    console.error("Error verifying session access:", error);
    return NextResponse.json(
      { error: "Failed to verify session access" },
      { status: 500 }
    );
  }
}
