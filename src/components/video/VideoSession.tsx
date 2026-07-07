"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import {
  agoraService,
  VideoSessionConfig,
  VideoSessionState,
} from "@/lib/services/agora-service";
import { AppointmentService } from "@/lib/services/appointment-service";
import { VideoControls } from "./VideoControls";
import { ConnectionStatus } from "./ConnectionStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VideoSessionProps {
  appointmentId: string;
  userId: string;
  userRole: "therapist" | "client" | "guest";
  duration: number; // Duration in minutes
  scheduledFor: Date; // Scheduled start time
  guestName?: string;
  meetingPasscode?: string;
  onSessionEnd?: () => void;
  className?: string;
}

interface SessionNotification {
  id: string;
  title: string;
  description: string;
}

export function VideoSession({
  appointmentId,
  userId,
  userRole,
  duration,
  scheduledFor,
  guestName,
  meetingPasscode,
  onSessionEnd,
  className = "",
}: VideoSessionProps) {
  const SESSION_DURATION_SECONDS = 60 * 60;
  const BUFFER_DURATION_SECONDS = 5 * 60;
  const TOTAL_SESSION_SECONDS =
    SESSION_DURATION_SECONDS + BUFFER_DURATION_SECONDS;

  const [sessionState, setSessionState] = useState<VideoSessionState>(
    agoraService.getCurrentState()
  );
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [notifications, setNotifications] = useState<SessionNotification[]>([]);
  const [isTherapistEndDialogOpen, setIsTherapistEndDialogOpen] =
    useState(false);
  const [therapistClientNote, setTherapistClientNote] = useState("");
  const [therapistPrivateSummary, setTherapistPrivateSummary] = useState("");
  const [isEndingSession, setIsEndingSession] = useState(false);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const milestonesTriggered = useRef<Set<string>>(new Set());
  const statusChangeRef = useRef({
    started: false,
    completed: false,
    completionInFlight: false,
  });

  // Generate channel name based on appointment ID
  const channelName = `therapy_session_${appointmentId}`;

  // Fixed live-session window: 60 minutes plus a 5 minute wrap-up buffer.
  const sessionDurationSeconds = SESSION_DURATION_SECONDS;
  const bufferDurationSeconds = BUFFER_DURATION_SECONDS;
  const totalSessionSeconds = TOTAL_SESSION_SECONDS;
  const sessionEndTimestamp =
    scheduledFor.getTime() + totalSessionSeconds * 1000;

  const addNotification = useCallback((title: string, description: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setNotifications((prev) => [
      { id, title, description },
      ...prev.slice(0, 2),
    ]);

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: description });
    }

    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 7000);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window) || Notification.permission !== "default") {
      return;
    }

    try {
      await Notification.requestPermission();
    } catch (permissionError) {
      console.error("Failed to request notification permission:", permissionError);
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (
    status: "in_progress" | "completed"
  ) => {
    await AppointmentService.updateAppointmentStatus(appointmentId, status);
  }, [appointmentId]);

  const markSessionStarted = useCallback(async () => {
    if (userRole !== "client" || statusChangeRef.current.started) {
      return;
    }

    try {
      await updateAppointmentStatus("in_progress");
      statusChangeRef.current.started = true;
    } catch (statusError) {
      console.error("Failed to mark session in progress:", statusError);
      setError("Connected to video, but failed to update session status.");
    }
  }, [updateAppointmentStatus, userRole]);

  const markSessionCompleted = useCallback(async () => {
    if (
      userRole !== "client" ||
      statusChangeRef.current.completed ||
      statusChangeRef.current.completionInFlight
    ) {
      return;
    }

    statusChangeRef.current.completionInFlight = true;

    try {
      await updateAppointmentStatus("completed");
      statusChangeRef.current.completed = true;
    } catch (statusError) {
      console.error("Failed to mark session completed:", statusError);
      setError("Video session ended, but failed to complete the appointment.");
    } finally {
      statusChangeRef.current.completionInFlight = false;
    }
  }, [updateAppointmentStatus, userRole]);

  const handleLeaveSession = useCallback(async (isAutoCompleted = false) => {
    try {
      const shouldCompleteSession =
        userRole === "client" &&
        (sessionState.isConnected || isAutoCompleted) &&
        !statusChangeRef.current.completed;

      if (shouldCompleteSession) {
        await markSessionCompleted();
      }

      await agoraService.leaveSession();
      onSessionEnd?.();
    } catch (err) {
      console.error("Failed to leave session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to leave video session"
      );
    }
  }, [markSessionCompleted, onSessionEnd, sessionState.isConnected, userRole]);

  const requestTherapistSessionEnd = useCallback(() => {
    setIsTherapistEndDialogOpen(true);
  }, []);

  const completeTherapistSessionEnd = useCallback(async () => {
    if (
      !therapistClientNote.trim() ||
      !therapistPrivateSummary.trim()
    ) {
      setError("Please add both a note to the client and a private summary.");
      return;
    }

    try {
      setIsEndingSession(true);
      setError(null);

      await AppointmentService.updateTherapistSessionNotes(appointmentId, {
        therapistNotes: therapistClientNote.trim(),
        internalNotes: therapistPrivateSummary.trim(),
      });
      await updateAppointmentStatus("completed");
      await agoraService.leaveSession();
      setIsTherapistEndDialogOpen(false);
      onSessionEnd?.();
    } catch (err) {
      console.error("Failed to end therapist session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to end video session"
      );
    } finally {
      setIsEndingSession(false);
    }
  }, [
    appointmentId,
    onSessionEnd,
    therapistClientNote,
    therapistPrivateSummary,
    updateAppointmentStatus,
  ]);

  useEffect(() => {
    const unsubscribe = agoraService.onStateChange(setSessionState);
    return unsubscribe;
  }, []);

  // Timer effect - starts immediately, not just when connected
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const remaining = Math.floor((sessionEndTimestamp - now.getTime()) / 1000);
      
      setTimeRemaining(Math.max(0, remaining));

      // Auto-end session when time expires (only if connected)
      if (remaining <= 0 && !isSessionExpired && sessionState.isConnected) {
        setIsSessionExpired(true);
        if (userRole === "therapist") {
          requestTherapistSessionEnd();
        } else {
          void handleLeaveSession(true);
        }
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [
    handleLeaveSession,
    isSessionExpired,
    requestTherapistSessionEnd,
    sessionEndTimestamp,
    sessionState.isConnected,
    userRole,
  ]);

  useEffect(() => {
    if (!sessionState.isConnected) {
      return;
    }

    void markSessionStarted();
  }, [markSessionStarted, sessionState.isConnected]);

  useEffect(() => {
    if (!sessionState.isConnected || sessionDurationSeconds <= 0) {
      return;
    }

    const elapsedSeconds = Math.max(0, totalSessionSeconds - timeRemaining);
    const mainSessionTimeRemaining = Math.max(
      0,
      timeRemaining - bufferDurationSeconds
    );
    const milestoneDefinitions = [
      {
        key: "half",
        shouldTrigger: elapsedSeconds >= Math.floor(sessionDurationSeconds / 2),
        title: "Halfway through session",
        description: "50% of the scheduled session time has elapsed.",
      },
      {
        key: "three-quarters",
        shouldTrigger: elapsedSeconds >= Math.floor(sessionDurationSeconds * 0.75),
        title: "Three quarters complete",
        description: "75% of the session has elapsed.",
      },
      {
        key: "five-minutes",
        shouldTrigger:
          mainSessionTimeRemaining > 0 &&
          mainSessionTimeRemaining <= 5 * 60,
        title: "5 minutes remaining",
        description: "Please begin wrapping up the therapy session.",
      },
      {
        key: "buffer",
        shouldTrigger:
          timeRemaining > 0 && timeRemaining <= bufferDurationSeconds,
        title: "Buffer time started",
        description:
          "The scheduled hour is complete. You are now in the 5 minute wrap-up buffer.",
      },
      {
        key: "one-minute",
        shouldTrigger: timeRemaining > 0 && timeRemaining <= 60,
        title: "1 minute remaining",
        description: "The session is about to end.",
      },
    ];

    milestoneDefinitions.forEach((milestone) => {
      if (
        milestone.shouldTrigger &&
        !milestonesTriggered.current.has(milestone.key)
      ) {
        milestonesTriggered.current.add(milestone.key);
        addNotification(milestone.title, milestone.description);
      }
    });
  }, [
    addNotification,
    bufferDurationSeconds,
    sessionDurationSeconds,
    sessionState.isConnected,
    timeRemaining,
    totalSessionSeconds,
  ]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Play local video when track is available
    if (sessionState.isVideoEnabled && localVideoRef.current) {
      const localVideoTrack = agoraService.getLocalVideoTrack();
      if (localVideoTrack) {
        localVideoTrack.play(localVideoRef.current);
      }
    }
  }, [sessionState.isVideoEnabled]);

  useEffect(() => {
    // Play remote videos when users join
    sessionState.remoteUsers.forEach((user) => {
      if (user.videoTrack && remoteVideoRefs.current[user.uid.toString()]) {
        user.videoTrack.play(remoteVideoRefs.current[user.uid.toString()]!);
      }
      if (user.audioTrack) {
        user.audioTrack.play();
      }
    });
  }, [sessionState.remoteUsers]);

  const handleJoinSession = async () => {
    try {
      setIsJoining(true);
      setError(null);
      await requestNotificationPermission();

      const config: VideoSessionConfig = {
        appointmentId,
        userId,
        userRole,
        channelName,
        guestName,
        meetingPasscode,
      };

      // In a real implementation, you'd get the Firebase token from useAuth or similar
      const firebaseToken = "placeholder_token";
      await agoraService.joinSession(config, firebaseToken);
    } catch (err) {
      console.error("Failed to join session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to join video session"
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleToggleVideo = async () => {
    try {
      await agoraService.toggleVideo();
    } catch (err) {
      console.error("Failed to toggle video:", err);
      setError("Failed to toggle video");
    }
  };

  const handleToggleAudio = async () => {
    try {
      await agoraService.toggleAudio();
    } catch (err) {
      console.error("Failed to toggle audio:", err);
      setError("Failed to toggle audio");
    }
  };

  const handleSwitchCamera = async () => {
    try {
      await agoraService.switchCamera();
    } catch (err) {
      console.error("Failed to switch camera:", err);
      setError("Failed to switch camera");
    }
  };

  if (
    !sessionState.isConnected &&
    sessionState.connectionStatus === "disconnected"
  ) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Video Session</h3>
              <p className="text-sm text-gray-600">
                Ready to join your therapy session
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleJoinSession}
              disabled={isJoining}
              className="w-full"
            >
              {isJoining ? "Joining..." : "Join Video Session"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isInBufferTime =
    timeRemaining > 0 && timeRemaining <= bufferDurationSeconds;
  const displaySessionTimeRemaining = isInBufferTime
    ? bufferDurationSeconds
    : Math.max(0, timeRemaining - bufferDurationSeconds);
  const handlePrimaryEndAction = () => {
    if (userRole === "therapist") {
      requestTherapistSessionEnd();
      return;
    }

    void handleLeaveSession();
  };

  return (
      <div className={`space-y-4 ${className}`}>
      <Dialog
        open={isTherapistEndDialogOpen}
        onOpenChange={(open) => {
          if (isEndingSession) return;
          setIsTherapistEndDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="therapist-client-note">Note To Client</Label>
              <Textarea
                id="therapist-client-note"
                value={therapistClientNote}
                onChange={(event) => setTherapistClientNote(event.target.value)}
                placeholder="Add the follow-up note the client should see after this session..."
                rows={4}
              />
              <p className="mt-2 text-xs text-gray-500">
                This will be visible to the client after the session ends.
              </p>
            </div>
            <div>
              <Label htmlFor="therapist-private-summary">Private Summary</Label>
              <Textarea
                id="therapist-private-summary"
                value={therapistPrivateSummary}
                onChange={(event) =>
                  setTherapistPrivateSummary(event.target.value)
                }
                placeholder="Add your therapist-only summary for this session..."
                rows={5}
              />
              <p className="mt-2 text-xs text-gray-500">
                This remains private and is not visible to the client.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTherapistEndDialogOpen(false)}
              disabled={isEndingSession}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void completeTherapistSessionEnd()}
              disabled={
                isEndingSession ||
                !therapistClientNote.trim() ||
                !therapistPrivateSummary.trim()
              }
            >
              {isEndingSession ? "Ending..." : "End Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection Status and Timer */}
      <div className="flex items-center justify-between gap-4">
        <ConnectionStatus
          status={sessionState.connectionStatus}
          participantCount={sessionState.participantCount}
        />
        
        {/* Session Timer */}
        <Card className={`${timeRemaining <= 120 ? 'border-red-500 bg-red-50' : timeRemaining <= 300 ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
          <CardContent className="py-2 px-4">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${timeRemaining <= 120 ? 'bg-red-500 animate-pulse' : timeRemaining <= 300 ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <div>
                <div className={`font-mono text-lg font-bold ${timeRemaining <= 120 ? 'text-red-700' : timeRemaining <= 300 ? 'text-yellow-700' : 'text-green-700'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-600">
                  {isInBufferTime
                    ? `Buffer time: ${formatTime(timeRemaining)} remaining`
                    : `Main session: ${formatTime(displaySessionTimeRemaining)} remaining`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              className="border-amber-200 bg-amber-50 text-amber-900"
            >
              <Bell className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                {notification.title}
                <Badge variant="outline" className="border-amber-300 bg-white/60">
                  Timer alert
                </Badge>
              </AlertTitle>
              <AlertDescription>{notification.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Time warning alerts */}
      {timeRemaining <= 120 && timeRemaining > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <Clock3 className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            ⚠️ Session will end in {Math.ceil(timeRemaining / 60)} minute{Math.ceil(timeRemaining / 60) !== 1 ? 's' : ''}. Please wrap up your conversation.
          </AlertDescription>
        </Alert>
      )}

      {isInBufferTime && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <Clock3 className="h-4 w-4" />
          <AlertDescription className="text-yellow-900">
            The 60-minute session is complete. You are now using the 5-minute buffer period.
          </AlertDescription>
        </Alert>
      )}
      
      {timeRemaining === 0 && (
        <Alert className="border-red-500 bg-red-50">
          <Clock3 className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            Session time has expired. The call will end automatically.
          </AlertDescription>
        </Alert>
      )}

      {/* Grid Layout for Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Video */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <div
                ref={localVideoRef}
                className="absolute inset-0 bg-gray-900 overflow-hidden"
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-md text-sm font-medium">
                You ({userRole})
              </div>
              {!sessionState.isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl text-white">
                      {userRole === "therapist" ? "T" : "C"}
                    </span>
                  </div>
                  <span className="text-white text-sm">Video Off</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Remote Videos */}
        {sessionState.remoteUsers.map((user: IAgoraRTCRemoteUser) => (
          <Card key={user.uid} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <div
                  ref={(el) => {
                    remoteVideoRefs.current[user.uid.toString()] = el;
                  }}
                  className="absolute inset-0 bg-gray-900 overflow-hidden"
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-md text-sm font-medium">
                  {userRole === "therapist" ? "Client" : "Therapist"}
                </div>
                {!user.videoTrack && (
                  <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <span className="text-3xl text-white">
                        {userRole === "therapist" ? "C" : "T"}
                      </span>
                    </div>
                    <span className="text-white text-sm">Video Off</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Show waiting message if no remote users */}
        {sessionState.remoteUsers.length === 0 && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <span className="text-3xl text-gray-600">
                    {userRole === "therapist" ? "C" : "T"}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">
                  Waiting for {userRole === "therapist" ? "client" : "therapist"}...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <VideoControls
        isVideoEnabled={sessionState.isVideoEnabled}
        isAudioEnabled={sessionState.isAudioEnabled}
        onToggleVideo={handleToggleVideo}
        onToggleAudio={handleToggleAudio}
        onSwitchCamera={handleSwitchCamera}
        onLeaveSession={handlePrimaryEndAction}
        endButtonTitle={
          userRole === "therapist" ? "End session" : "Leave session"
        }
        endButtonLabel={userRole === "therapist" ? undefined : "Leave Room"}
      />
    </div>
  );
}
