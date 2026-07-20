"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, ShieldCheck, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/types/database";
import { getTherapySessionConfig } from "@/lib/session/therapy-session";
import { trackSessionAccessVerified } from "@/lib/analytics/gtag";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"therapist" | "client" | "guest" | null>(null);
  const [meetingPasscode, setMeetingPasscode] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isVerifyingGuest, setIsVerifyingGuest] = useState(false);
  const trackedSessionAccessRef = useRef<string | null>(null);

  const appointmentId = params.appointmentId as string;

  useEffect(() => {
    const passcodeFromQuery = searchParams.get("passcode");
    const guestFromQuery = searchParams.get("guest");

    if (passcodeFromQuery && !meetingPasscode) {
      setMeetingPasscode(passcodeFromQuery);
    }

    if (guestFromQuery && !guestName) {
      setGuestName(guestFromQuery);
    }
  }, [guestName, meetingPasscode, searchParams]);

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    const loadAuthenticatedAppointment = async () => {
      if (!appointmentId || !user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Loading session access details", {
          appointmentId,
          userId: user.uid,
        });

        const response = await fetch(`/api/session/access/${appointmentId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load session");
        }

        console.log("Session access details loaded", {
          appointmentId,
          viewerRole: data.viewerRole,
          appointmentStatus: data.appointment?.status,
          platform: data.appointment?.session?.platform || null,
          meetingId: data.appointment?.session?.meetingId || null,
          providerJoinUrl: data.appointment?.session?.providerJoinUrl || null,
        });

        if (
          data.appointment.status !== "confirmed" &&
          data.appointment.status !== "in_progress"
        ) {
          throw new Error(
            `This session is ${data.appointment.status}. Only confirmed sessions can be joined.`
          );
        }

        setAppointment(data.appointment as Appointment);
        setUserRole(data.viewerRole);
      } catch (err) {
        console.error("Error loading appointment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load appointment details"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadAuthenticatedAppointment();
  }, [appointmentId, user]);

  const handleSessionEnd = useCallback(() => {
    // Redirect based on user role
    if (userRole === "therapist") {
      router.push("/therapist/appointments");
    } else if (userRole === "guest") {
      router.push("/");
    } else {
      router.push("/client/appointments");
    }
  }, [router, userRole]);

  const handleGoBack = useCallback(() => {
    if (userRole === "therapist") {
      router.push("/therapist/appointments");
    } else if (userRole === "guest") {
      router.push("/");
    } else {
      router.push("/client/appointments");
    }
  }, [router, userRole]);

  useEffect(() => {
    if (!appointmentId || !userRole || userRole === "therapist" || !appointment) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/session/access/${appointmentId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            userRole === "guest"
              ? { meetingPasscode: meetingPasscode.trim() }
              : {}
          ),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.appointment) {
          return;
        }

        if (
          data.appointment.status === "completed" ||
          data.appointment.status === "cancelled"
        ) {
          setError("This session has been ended by the therapist.");
          handleSessionEnd();
        }
      } catch (pollError) {
        console.error("Failed to poll session status:", pollError);
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [
    appointment,
    appointmentId,
    handleSessionEnd,
    meetingPasscode,
    userRole,
  ]);

  useEffect(() => {
    if (!appointment || !userRole) {
      return;
    }

    const trackingKey = `${appointment.id}:${userRole}:${appointment.status}`;
    if (trackedSessionAccessRef.current === trackingKey) {
      return;
    }

    trackedSessionAccessRef.current = trackingKey;

    trackSessionAccessVerified({
      appointment_id: appointment.id,
      viewer_role: userRole,
      session_type: appointment.session?.type,
      status: appointment.status,
    });
  }, [appointment, userRole]);

  const handleGuestAccess = async () => {
    if (!meetingPasscode.trim() || !guestName.trim()) {
      setError("Enter the meeting passcode and your name to join.");
      return;
    }

    try {
      setIsVerifyingGuest(true);
      setError(null);
      setLoading(true);

      const response = await fetch(`/api/session/access/${appointmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingPasscode: meetingPasscode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to verify meeting credentials");
      }

      if (
        data.appointment.status !== "confirmed" &&
        data.appointment.status !== "in_progress"
      ) {
        throw new Error(
          `This session is ${data.appointment.status}. Only confirmed sessions can be joined.`
        );
      }

      setAppointment(data.appointment as Appointment);
      setUserRole("guest");
    } catch (err) {
      console.error("Error verifying guest access:", err);
      setError(
        err instanceof Error ? err.message : "Unable to verify meeting credentials"
      );
    } finally {
      setLoading(false);
      setIsVerifyingGuest(false);
    }
  };

  const handleLaunchMeeting = useCallback(() => {
    const meetUrl = appointment?.session?.providerJoinUrl;
    console.log("Attempting to launch Google Meet", {
      appointmentId,
      meetingId: appointment?.session?.meetingId || null,
      providerJoinUrl: meetUrl || null,
      platform: appointment?.session?.platform || null,
    });

    if (!meetUrl) {
      console.error("Google Meet launch blocked because providerJoinUrl is missing", {
        appointmentId,
        appointment,
      });
      setError("The Google Meet link is not ready yet. Please try again shortly.");
      return;
    }

    window.open(meetUrl, "_blank", "noopener,noreferrer");
  }, [appointment]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user && !appointment) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-10">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Video className="h-5 w-5 text-teal-600" />
            <div>
              <h1 className="text-xl font-semibold">Join Therapy Session</h1>
              <p className="text-sm text-gray-600">
                Enter the meeting passcode shared after booking.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Meeting ID</label>
              <Input value={appointmentId} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Your Name</label>
              <Input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Passcode</label>
              <Input
                value={meetingPasscode}
                onChange={(event) => setMeetingPasscode(event.target.value)}
                placeholder="Enter meeting passcode"
              />
            </div>
            <Button onClick={handleGuestAccess} className="w-full" disabled={isVerifyingGuest}>
              {isVerifyingGuest ? "Verifying..." : "Join as Participant"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment || !userRole || (!user && userRole !== "guest")) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error || "Unable to load session"}</AlertDescription>
        </Alert>
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const sessionConfig = getTherapySessionConfig(appointment.session?.type);
  const participantAllowance =
    appointment.session?.maxClientParticipants ||
    sessionConfig.clientParticipants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={handleGoBack} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-teal-600" />
                <h1 className="text-xl font-semibold">Therapy Session</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {userRole === "therapist"
                ? "Therapist View"
                : userRole === "guest"
                ? `Guest View${guestName ? ` • ${guestName}` : ""}`
                : "Client View"}
            </div>
          </div>
        </div>
      </div>

      {/* Video Session */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 via-white to-blue-50 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-teal-700 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Access verified for{" "}
                  {userRole === "guest" ? guestName || "guest participant" : userRole}
                </div>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                    Your session is ready
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                    Join your secure therapy session when you&apos;re ready. Access for this appointment has already been verified.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleLaunchMeeting}
                className="min-w-[220px] self-start rounded-xl bg-teal-600 px-6 text-base font-semibold text-white shadow-[0_14px_32px_rgba(13,148,136,0.28)] hover:bg-teal-500"
              >
                Join Session
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 sm:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Session Type
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {sessionConfig.label}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Duration
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {appointment.duration} minutes
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Meeting ID
              </p>
              <p className="mt-2 break-all text-lg font-semibold text-slate-900">
                {appointment.session?.meetingId || appointmentId}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Participants
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {userRole !== "therapist" ? participantAllowance : "Therapist host"}
              </p>
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-8">
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/80 p-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">
                  Before you join
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">
                  Make sure you&apos;re in a quiet, private place and that your camera, microphone, and internet connection are ready before you begin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Session Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure you have a stable internet connection</li>
            <li>• Use headphones for better audio quality</li>
            <li>• Find a quiet, private space for your session</li>
            <li>• Test your camera and microphone before starting</li>
            {userRole === "client" && (
              <li>• Your session is confidential and secure</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
