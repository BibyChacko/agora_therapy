import { NextRequest, NextResponse } from "next/server";
import { RtcRole, RtcTokenBuilder } from "agora-token";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyRequestUser } from "@/lib/server/firebase-request-auth";
import { createRateLimitResponse } from "@/lib/server/rate-limit";
import {
  getTherapySessionConfig,
  normalizeTherapySessionType,
} from "@/lib/session/therapy-session";

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

function makeNumericUid(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return (hash % 2147483646) + 1;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = createRateLimitResponse(request, {
      keyPrefix: "agora-token",
      windowMs: 60 * 1000,
      maxRequests: 20,
    });

    if (!rateLimit.ok) {
      return rateLimit.response;
    }

    const body = await request.json();
    const {
      appointmentId,
      channelName,
      userId,
      meetingPasscode,
      guestName,
    } = body as {
      appointmentId?: string;
      channelName?: string;
      userId?: string;
      meetingPasscode?: string;
      guestName?: string;
    };

    if (!appointmentId || !channelName || !userId) {
      return NextResponse.json(
        { error: "Missing appointmentId, channelName, or userId" },
        { status: 400 }
      );
    }

    if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
      return NextResponse.json(
        { error: "Agora credentials not configured" },
        { status: 500 }
      );
    }

    const db = getAdminFirestore();
    const appointmentDoc = await db.collection("appointments").doc(appointmentId).get();

    if (!appointmentDoc.exists) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const appointment = appointmentDoc.data();
    const sessionType = normalizeTherapySessionType(appointment?.session?.type);
    const sessionConfig = getTherapySessionConfig(sessionType);
    const sessionCredentialRef = db.collection("sessionCredentials").doc(appointmentId);
    const sessionCredentialDoc = await sessionCredentialRef.get();
    const sessionCredentialData = sessionCredentialDoc.data();

    const verifiedUser = await verifyRequestUser(request);
    let participantId = "";
    let participantRole: "therapist" | "client" | "guest" = "guest";

    if (verifiedUser && verifiedUser.uid === appointment?.therapistId) {
      const therapistDoc = await db.collection("users").doc(verifiedUser.uid).get();
      const therapistData = therapistDoc.data();

      if (therapistData?.role !== "therapist") {
        return NextResponse.json(
          { error: "Only therapist accounts can join as therapist." },
          { status: 403 }
        );
      }

      participantRole = "therapist";
      participantId = `therapist:${verifiedUser.uid}`;
    } else if (verifiedUser && verifiedUser.uid === appointment?.clientId) {
      participantRole = "client";
      participantId = `client:${verifiedUser.uid}`;
    } else {
      if (!meetingPasscode || !guestName?.trim()) {
        return NextResponse.json(
          { error: "Meeting passcode and participant name are required." },
          { status: 401 }
        );
      }

      if (sessionCredentialData?.meetingPasscode !== meetingPasscode) {
        return NextResponse.json(
          { error: "Invalid meeting passcode." },
          { status: 403 }
        );
      }

      participantRole = "guest";
      participantId = `guest:${guestName.trim().toLowerCase()}`;
    }

    const participantIds = Array.isArray(sessionCredentialData?.participantIds)
      ? (sessionCredentialData?.participantIds as string[])
      : [];
    const nonTherapistParticipants = participantIds.filter(
      (id) => !id.startsWith("therapist:")
    );
    const isNewParticipant = !participantIds.includes(participantId);

    if (
      participantRole !== "therapist" &&
      isNewParticipant &&
      nonTherapistParticipants.length >= sessionConfig.clientParticipants
    ) {
      return NextResponse.json(
        { error: "This meeting has reached its participant limit." },
        { status: 409 }
      );
    }

    if (isNewParticipant) {
      await sessionCredentialRef.set(
        {
          participantIds: FieldValue.arrayUnion(participantId),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const uid = makeNumericUid(
      `${appointmentId}:${participantRole}:${verifiedUser?.uid || guestName || userId}`
    );

    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
      privilegeExpiredTs
    );

    const response = NextResponse.json({
      token,
      appId: AGORA_APP_ID,
      appointmentId,
      channelName,
      uid,
      participantRole,
      expiresAt: privilegeExpiredTs,
    });

    Object.entries(rateLimit.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return NextResponse.json(
      {
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
