import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { emailService } from "@/lib/services/email-service";
import { googleMeetService } from "@/lib/services/google-meet-service";
import {
  generateMeetingPasscode,
  getTherapySessionConfig,
  normalizeTherapySessionType,
} from "@/lib/session/therapy-session";

interface FinalizeAppointmentPaymentOptions {
  appointmentId: string;
  paymentMethod: "stripe" | "tamara";
  providerTransactionId?: string;
  providerCheckoutId?: string | null;
  providerStatus?: string | null;
}

export async function finalizeAppointmentPayment({
  appointmentId,
  paymentMethod,
  providerTransactionId,
  providerCheckoutId,
  providerStatus,
}: FinalizeAppointmentPaymentOptions) {
  const db = getAdminFirestore();
  const appointmentDoc = await db.collection("appointments").doc(appointmentId).get();

  if (!appointmentDoc.exists) {
    throw new Error(`Appointment not found for payment finalization: ${appointmentId}`);
  }

  const appointmentData = appointmentDoc.data()!;
  const existingStatus = appointmentData.status;
  const existingPaymentStatus = appointmentData.payment?.status;

  if (
    existingPaymentStatus === "paid" &&
    ["confirmed", "in_progress", "completed"].includes(existingStatus)
  ) {
    console.log("Payment finalization skipped because appointment is already confirmed", {
      appointmentId,
      paymentMethod,
    });
    return;
  }

  const sessionConfig = getTherapySessionConfig(
    normalizeTherapySessionType(appointmentData.session?.type)
  );

  const meetingPasscode = generateMeetingPasscode();
  const meetingLink = googleMeetService.getSessionLandingUrl(appointmentId);
  let meetingId = appointmentId;
  let providerJoinUrl: string | null = null;
  let providerSpaceName: string | null = null;
  let sessionProvisioningWarning: string | null = null;

  try {
    console.log("Attempting Google Meet provisioning", { appointmentId, paymentMethod });
    const meetingSpace = await googleMeetService.createMeetingSpace();
    meetingId = meetingSpace.meetingCode;
    providerJoinUrl = meetingSpace.meetingUri;
    providerSpaceName = meetingSpace.spaceName;
    console.log("Google Meet provisioning succeeded", {
      appointmentId,
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
      appointmentId,
      sessionProvisioningWarning
    );
  }

  console.log("Persisting session details to appointment", {
    appointmentId,
    meetingId,
    providerJoinUrl,
    providerSpaceName,
    sessionProvisioningWarning,
    paymentMethod,
    providerTransactionId,
    providerCheckoutId,
    providerStatus,
  });

  await appointmentDoc.ref.update({
    status: "confirmed",
    "payment.status": "paid",
    "payment.method": paymentMethod,
    "payment.transactionId":
      providerTransactionId || appointmentData.payment?.transactionId || "",
    "payment.providerCheckoutId":
      providerCheckoutId || appointmentData.payment?.providerCheckoutId || null,
    "payment.providerStatus": providerStatus || "paid",
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

  await db.collection("sessionCredentials").doc(appointmentId).set({
    appointmentId,
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
    appointmentId,
    meetingId,
    providerJoinUrl,
  });

  const [clientDoc, therapistDoc] = await Promise.all([
    db.collection("users").doc(appointmentData.clientId).get(),
    db.collection("users").doc(appointmentData.therapistId).get(),
  ]);

  const clientData = clientDoc.data();
  const therapistData = therapistDoc.data();

  console.log("📧 Preparing to send confirmation emails...");
  console.log("Client Email:", clientData?.email);
  console.log("Therapist Email:", therapistData?.email);
  console.log("Meeting Link:", meetingLink);

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
  }
}
