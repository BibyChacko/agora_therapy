"use client";

import { useEffect, useState } from "react";
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
import { Calendar, Clock, User, Video, AlertCircle, Download, FileText } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/types/database";
import Link from "next/link";
import { useToast } from "@/lib/hooks/useToast";
import { generateInvoicePdf } from "@/lib/utils/invoice-pdf";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MySessionsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.uid) {
      loadAppointments();
    }
  }, [user?.uid]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AppointmentService.getClientAppointments(user!.uid);
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load your appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="border border-blue-200/60 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              {formatDate(appointment.scheduledFor)}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2 ml-12">
              <Clock className="h-4 w-4" />
              {formatTime(appointment.scheduledFor)} - {appointment.duration}{" "}
              minutes
            </CardDescription>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="ml-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className="font-medium">
              {getTherapistDisplayName(appointment)}
            </span>
          </div>

          <div>
            <span className="font-medium">Session Type: </span>
            <span className="capitalize">
              {appointment.session?.type || "Individual Therapy"}
            </span>
          </div>

          {appointment.session?.meetingId && (
            <div>
              <span className="font-medium">Meeting ID: </span>
              <span>{appointment.session.meetingId}</span>
            </div>
          )}

          {appointment.session?.meetingPasscode && (
            <div>
              <span className="font-medium">Passcode: </span>
              <span>{appointment.session.meetingPasscode}</span>
            </div>
          )}

          {appointment.communication?.clientNotes && (
            <div>
              <span className="font-medium">Notes: </span>
              <span>{appointment.communication.clientNotes}</span>
            </div>
          )}

          {appointment.communication?.therapistNotes && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3">
              <span className="font-medium text-teal-900">
                Therapist Note:
              </span>{" "}
              <span className="text-teal-900">
                {appointment.communication.therapistNotes}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {/* Download Invoice Button - Show for all appointments */}
            <Button
              variant="outline"
              onClick={() => handleDownloadInvoice(appointment)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>

            {/* Join Now - Only for active sessions */}
            {isActiveNow(appointment) && (
              <Button
                onClick={() => handleJoinSession(appointment)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 animate-pulse"
                disabled={!appointment.session?.joinUrl}
              >
                <Video className="h-4 w-4" />
                Join Now
              </Button>
            )}

            {/* Join Session - For upcoming but not yet active */}
            {isUpcoming(appointment) && !isActiveNow(appointment) && (
              <Button
                onClick={() => handleJoinSession(appointment)}
                className="flex items-center gap-2"
                disabled={!appointment.session?.joinUrl}
              >
                <Video className="h-4 w-4" />
                Join Session
              </Button>
            )}

            {/* Reschedule and Cancel - Only for upcoming */}
            {isUpcoming(appointment) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleRescheduleAppointment(appointment.id)}
                >
                  Reschedule
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">
            Manage your therapy appointments and join upcoming sessions
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upcoming" className="w-full space-y-6">
          <TabsList className="inline-flex h-auto w-auto gap-2 bg-transparent p-0 shadow-none">
            <TabsTrigger
              value="upcoming"
              className="rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-none data-[state=active]:border-teal-500 data-[state=active]:bg-white data-[state=active]:text-teal-600"
            >
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-none data-[state=active]:border-teal-500 data-[state=active]:bg-white data-[state=active]:text-teal-600"
            >
              Past ({pastAppointments.length + cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Past Appointments</h2>
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
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Cancelled Appointments</h2>
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
    </ClientLayout>
  );
}
