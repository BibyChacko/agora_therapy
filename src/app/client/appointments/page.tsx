"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { AppointmentService } from "@/lib/services/appointment-service";
import { ClientLayout } from "@/components/client/ClientLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, User, Video, AlertCircle, Download, FileText, MessageSquare, Star } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/types/database";
import Link from "next/link";
import { useToast } from "@/lib/hooks/useToast";
import { generateInvoicePdf } from "@/lib/utils/invoice-pdf";
import { formatAmountFromMinorUnits } from "@/lib/utils/currency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function MySessionsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewedAppointmentIds, setReviewedAppointmentIds] = useState<string[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviewAppointment, setSelectedReviewAppointment] =
    useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { toast } = useToast();

  const loadAppointments = useCallback(async () => {
    if (!user?.uid) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, reviewsResponse] = await Promise.all([
        AppointmentService.getClientAppointments(user.uid),
        fetch("/api/client/reviews"),
      ]);

      const reviewsData = reviewsResponse.ok ? await reviewsResponse.json() : { reviews: [] };

      setReviewedAppointmentIds(
        (reviewsData.reviews || [])
          .map((review: { appointmentId?: string }) => review.appointmentId)
          .filter(Boolean)
      );
      setAppointments(appointmentsData);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      void loadAppointments();
    }
  }, [loadAppointments, user?.uid]);

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-rose-100 text-rose-700";
      case "refunded":
        return "bg-slate-200 text-slate-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const isUpcoming = (appointment: Appointment) => {
    const timestamp = appointment.scheduledFor as any;
    const appointmentDate = timestamp?.toDate?.() || new Date(timestamp);
    return appointmentDate > new Date() && appointment.status !== "cancelled";
  };

  const isPast = (appointment: Appointment) => {
    const timestamp = appointment.scheduledFor as any;
    const appointmentDate = timestamp?.toDate?.() || new Date(timestamp);
    return appointmentDate <= new Date() || appointment.status === "completed";
  };

  const isActiveNow = (appointment: Appointment) => {
    const timestamp = appointment.scheduledFor as any;
    const appointmentDate = timestamp?.toDate?.() || new Date(timestamp);
    const now = new Date();
    const endTime = new Date(appointmentDate.getTime() + (appointment.duration || 60) * 60 * 1000);
    return now >= appointmentDate && now <= endTime && appointment.status === "confirmed";
  };

  const isCancelled = (appointment: Appointment) => {
    return appointment.status === "cancelled";
  };

  const isCompleted = (appointment: Appointment) => {
    return appointment.status === "completed";
  };

  const upcomingAppointments = appointments.filter(isUpcoming);
  const pastAppointments = appointments.filter(isPast);
  const cancelledAppointments = appointments.filter(isCancelled);

  const handleJoinSession = (appointment: Appointment) => {
    if (appointment.session?.joinUrl) {
      window.open(appointment.session.joinUrl, "_blank");
      toast.success("Joining Session", "Opening video session in new tab");
    } else {
      toast.error(
        "Link Not Available",
        "Session link is not available yet. Please check back closer to your appointment time."
      );
    }
  };

  const getTherapistDisplayName = (appointment: Appointment) => {
    return appointment.therapist?.name || appointment.therapistId || "Therapist";
  };

  const formatInvoiceAmount = (appointment: Appointment) => {
    return formatAmountFromMinorUnits(
      appointment.payment?.amount,
      appointment.payment?.currency
    );
  };

  const hasSubmittedFeedback = (appointmentId: string) => {
    return reviewedAppointmentIds.includes(appointmentId);
  };

  const openFeedbackDialog = (appointment: Appointment) => {
    setSelectedReviewAppointment(appointment);
    setReviewRating(0);
    setReviewComment("");
    setReviewDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedReviewAppointment) return;

    if (reviewRating < 1) {
      toast.error("Rating Required", "Please select a star rating before submitting.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch("/api/client/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: selectedReviewAppointment.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit feedback");
      }

      setReviewedAppointmentIds((current) => [
        ...current,
        selectedReviewAppointment.id,
      ]);
      setReviewDialogOpen(false);
      setSelectedReviewAppointment(null);
      toast.success("Feedback Submitted", "Thank you for sharing your feedback.");
    } catch (submitError) {
      console.error("Error submitting feedback:", submitError);
      toast.error(
        "Submission Failed",
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit your feedback. Please try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDownloadInvoice = async (appointment: Appointment) => {
    try {
      await generateInvoicePdf({
        appointment,
        clientName:
          userData?.profile?.displayName ||
          `${userData?.profile?.firstName || ""} ${userData?.profile?.lastName || ""}`.trim() ||
          user?.displayName ||
          "Client",
        clientEmail: userData?.email || user?.email || undefined,
      });

      toast.success("Invoice Downloaded", "Your invoice has been downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Download Failed", "Failed to download invoice. Please try again.");
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await AppointmentService.updateAppointmentStatus(
        appointmentId,
        "cancelled",
        "Cancelled by client"
      );
      await loadAppointments();
      toast.success("Appointment Cancelled", "Your appointment has been cancelled successfully");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      toast.error("Cancellation Failed", "Failed to cancel appointment. Please try again.");
    }
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    // This would typically open a rescheduling modal or redirect to booking flow
    alert("Rescheduling functionality will be implemented soon.");
  };

  function AppointmentCard({ appointment }: { appointment: Appointment }) {
    return (
      <Card className="overflow-hidden rounded-[1.4rem] border border-blue-200/70 bg-white shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition-shadow hover:shadow-[0_16px_36px_rgba(37,99,235,0.12)]">
        <CardHeader className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold leading-6 text-slate-900 sm:text-lg">
                    {formatDate(appointment.scheduledFor)}
                  </CardTitle>
                  <CardDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500 sm:text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {formatTime(appointment.scheduledFor)} - {appointment.duration} minutes
                    </span>
                  </CardDescription>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(appointment.status)} shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs`}>
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 pt-0 text-sm text-slate-700 sm:px-5 sm:pb-5">
          <div className="grid gap-3 rounded-[1.1rem] bg-slate-50/80 p-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Therapist
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                <span className="font-medium text-slate-900">
                  {getTherapistDisplayName(appointment)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Session type
              </p>
              <p className="font-medium capitalize text-slate-900">
                {appointment.session?.type || "Individual Therapy"}
              </p>
            </div>
          </div>

          {appointment.session?.meetingId && (
            <div className="text-sm leading-6">
              <span className="font-medium text-slate-900">Meeting ID: </span>
              <span className="break-all">{appointment.session.meetingId}</span>
            </div>
          )}

          {appointment.session?.meetingPasscode && (
            <div className="text-sm leading-6">
              <span className="font-medium text-slate-900">Passcode: </span>
              <span>{appointment.session.meetingPasscode}</span>
            </div>
          )}

          {appointment.communication?.clientNotes && (
            <div className="text-sm leading-6">
              <span className="font-medium text-slate-900">Notes: </span>
              <span>{appointment.communication.clientNotes}</span>
            </div>
          )}

          {appointment.communication?.therapistNotes && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm leading-6">
              <span className="font-medium text-teal-900">
                Therapist Note:
              </span>{" "}
              <span className="text-teal-900">
                {appointment.communication.therapistNotes}
              </span>
            </div>
          )}

          {(isUpcoming(appointment) || isCompleted(appointment)) && (
            <div className="mt-4 space-y-3">
              {isUpcoming(appointment) && (
                <div className="space-y-2">
                  {isActiveNow(appointment) ? (
                    <Button
                      onClick={() => handleJoinSession(appointment)}
                      className="min-h-11 w-full rounded-xl bg-green-600 px-3 text-sm text-white hover:bg-green-700 animate-pulse"
                      disabled={!appointment.session?.joinUrl}
                    >
                      <Video className="h-4 w-4" />
                      Join Now
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinSession(appointment)}
                      className="min-h-11 w-full rounded-xl bg-slate-900 px-3 text-sm text-white hover:bg-slate-800"
                      disabled={!appointment.session?.joinUrl}
                    >
                      <Video className="h-4 w-4" />
                      Join Session
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleRescheduleAppointment(appointment.id)}
                      className="min-h-11 w-full rounded-xl border-slate-200 px-3 text-sm"
                    >
                      Reschedule
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="min-h-11 w-full rounded-xl px-3 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-slate-50/80 px-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Invoice details
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatInvoiceAmount(appointment)}
                      </span>
                      <Badge
                        className={`${getPaymentStatusColor(appointment.payment?.status)} rounded-full px-2 py-0.5 text-[10px] font-semibold`}
                      >
                        {appointment.payment?.status || "pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDownloadInvoice(appointment)}
                  className="h-10 w-10 shrink-0 rounded-xl border-slate-200 bg-white"
                  aria-label={`Download invoice for appointment ${appointment.id}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {isCompleted(appointment) && !hasSubmittedFeedback(appointment.id) && (
            <Button
              variant="outline"
              onClick={() => openFeedbackDialog(appointment)}
              className="min-h-11 rounded-xl border-slate-200 px-3 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Give Feedback
            </Button>
          )}

          {isCompleted(appointment) && hasSubmittedFeedback(appointment.id) && (
            <Button
              variant="outline"
              disabled
              className="min-h-11 rounded-xl border-slate-200 px-3 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback Submitted
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (authLoading || loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-5 pb-32 sm:space-y-6 sm:pb-36 lg:space-y-8 lg:pb-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Appointments</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            Manage your therapy appointments and join upcoming sessions
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upcoming" className="w-full space-y-5 sm:space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-full bg-transparent p-0 shadow-none sm:inline-flex sm:w-auto">
            <TabsTrigger
              value="upcoming"
              className="min-h-11 rounded-full border border-blue-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-none data-[state=active]:border-teal-500 data-[state=active]:bg-white data-[state=active]:text-teal-600"
            >
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="min-h-11 rounded-full border border-blue-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-none data-[state=active]:border-teal-500 data-[state=active]:bg-white data-[state=active]:text-teal-600"
            >
              Past ({pastAppointments.length + cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Upcoming Appointments</h2>
                <p className="text-sm text-gray-600">{upcomingAppointments.length} scheduled sessions</p>
              </div>
            </div>

            {upcomingAppointments.length === 0 ? (
              <Card className="w-full border border-blue-200/60 bg-white shadow-sm">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ready to book your next therapy session?
                  </p>
                  <Button asChild className="bg-teal-500 hover:bg-teal-600">
                    <Link href="/client/therapists">Find a Therapist</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Past Appointments</h2>
                  <p className="text-sm text-gray-600">{pastAppointments.length} completed sessions</p>
                </div>
              </div>

              {pastAppointments.length === 0 ? (
                <Card className="w-full border border-blue-200/60 bg-white shadow-sm">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No past appointments
                    </h3>
                    <p className="text-gray-600">
                      Your completed sessions will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>

            {cancelledAppointments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Cancelled Appointments</h2>
                    <p className="text-sm text-gray-600">{cancelledAppointments.length} cancelled sessions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              Tell us how your session with{" "}
              {selectedReviewAppointment
                ? getTherapistDisplayName(selectedReviewAppointment)
                : "your therapist"}{" "}
              went.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Your rating</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="rounded-md p-1 transition-transform hover:scale-105"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Comments
              </p>
              <Textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Share anything that stood out about your session..."
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submittingReview}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={submittingReview}>
              {submittingReview ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
