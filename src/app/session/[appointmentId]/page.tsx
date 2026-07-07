"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Appointment } from "@/types/database";
import { getTherapySessionConfig } from "@/lib/session/therapy-session";

// Dynamically import VideoSession with no SSR
const VideoSession = dynamic(
  () => import("@/components/video/VideoSession").then(mod => ({ default: mod.VideoSession })),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center p-8"><LoadingSpinner /></div>
  }
);

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
    meetingPasscode,
    userRole,
  ]);

  const handleSessionEnd = () => {
    // Redirect based on user role
    if (userRole === "therapist") {
      router.push("/therapist/appointments");
    } else if (userRole === "guest") {
      router.push("/");
    } else {
      router.push("/client/sessions");
    }
  };

  const handleGoBack = () => {
    if (userRole === "therapist") {
      router.push("/therapist/appointments");
    } else if (userRole === "guest") {
      router.push("/");
    } else {
      router.push("/client/sessions");
    }
  };

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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Session Details
            </h2>
            <p className="text-sm text-gray-600">
              Appointment ID: {appointmentId}
            </p>
            <p className="text-sm text-gray-600">
              Duration: {appointment.duration} minutes
            </p>
            <p className="text-sm text-gray-600">
              Session Type: {sessionConfig.label}
            </p>
            <p className="text-sm text-gray-600">
              Meeting ID: {appointment.session?.meetingId || appointmentId}
            </p>
            {userRole !== "therapist" && (
              <p className="text-sm text-gray-600">
                Client-side participants allowed:{" "}
                {appointment.session?.maxClientParticipants ||
                  sessionConfig.clientParticipants}
              </p>
            )}
          </div>

          <VideoSession
            appointmentId={appointmentId}
            userId={user?.uid || `${appointmentId}:${guestName || "guest"}`}
            userRole={userRole}
            duration={appointment.duration || 60}
            scheduledFor={
              appointment.scheduledFor instanceof Date
                ? appointment.scheduledFor
                : (appointment.scheduledFor as any)?.toDate?.() || new Date()
            }
            guestName={userRole === "guest" ? guestName : undefined}
            meetingPasscode={userRole === "guest" ? meetingPasscode : undefined}
            onSessionEnd={handleSessionEnd}
            className="w-full"
          />
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
