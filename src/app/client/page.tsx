"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/hooks/useAuth";
import { AppointmentService } from "@/lib/services/appointment-service";
import { Appointment } from "@/types/database";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  Video,
} from "lucide-react";

function formatAppointmentDate(value: unknown) {
  const candidate = value as { toDate?: () => Date } | Date | string | number;
  const date =
    typeof candidate === "object" && candidate !== null && "toDate" in candidate
      ? candidate.toDate?.()
      : new Date(candidate as string | number | Date);

  if (!date || Number.isNaN(date.getTime())) {
    return "Date to be confirmed";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatAppointmentTime(value: unknown) {
  const candidate = value as { toDate?: () => Date } | Date | string | number;
  const date =
    typeof candidate === "object" && candidate !== null && "toDate" in candidate
      ? candidate.toDate?.()
      : new Date(candidate as string | number | Date);

  if (!date || Number.isNaN(date.getTime())) {
    return "Time to be confirmed";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateValue(value: unknown) {
  const candidate = value as { toDate?: () => Date } | Date | string | number;
  const date =
    typeof candidate === "object" && candidate !== null && "toDate" in candidate
      ? candidate.toDate?.()
      : new Date(candidate as string | number | Date);

  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export default function ClientDashboard() {
  const { user, userData, loading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const data = await AppointmentService.getClientAppointments(user!.uid);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading your dashboard..." />;
  }

  if (!user || !userData) {
    return null;
  }

  const now = new Date();
  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = getDateValue(appointment.scheduledFor);
      return appointmentDate && appointmentDate > now && appointment.status !== "cancelled";
    })
    .sort((a, b) => {
      const first = getDateValue(a.scheduledFor)?.getTime() || 0;
      const second = getDateValue(b.scheduledFor)?.getTime() || 0;
      return first - second;
    });

  const nextAppointment = upcomingAppointments[0] || null;
  const completedSessions = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;
  const totalSessions = appointments.length;

  const profileSignals = [
    Boolean(userData.profile?.firstName),
    Boolean(userData.profile?.lastName),
    Boolean(userData.email),
    Boolean(userData.profile?.phoneNumber),
    Boolean(userData.profile?.timezone),
  ];
  const profileCompletion = Math.round(
    (profileSignals.filter(Boolean).length / profileSignals.length) * 100
  );

  const stats = [
    {
      label: "Total sessions",
      value: totalSessions,
      helper: totalSessions === 0 ? "Your journey starts here" : "All booked sessions",
      icon: Video,
      tone: "from-teal-500 to-cyan-500",
    },
    {
      label: "Completed",
      value: completedSessions,
      helper:
        completedSessions === 0 ? "Your first milestone is ahead" : "Sessions finished successfully",
      icon: CheckCircle2,
      tone: "from-emerald-500 to-green-500",
    },
    {
      label: "Upcoming",
      value: upcomingAppointments.length,
      helper:
        upcomingAppointments.length === 0 ? "No future sessions booked" : "Planned check-ins ahead",
      icon: Calendar,
      tone: "from-amber-500 to-orange-500",
    },
    {
      label: "Profile complete",
      value: `${profileCompletion}%`,
      helper: "Keep your details ready for smoother care",
      icon: Sparkles,
      tone: "from-fuchsia-500 to-pink-500",
    },
  ];

  const accountItems = [
    {
      label: "Email",
      value: userData.email || "Not added",
      icon: Mail,
    },
    {
      label: "Phone",
      value: userData.profile?.phoneNumber || "Add a contact number",
      icon: Phone,
    },
    {
      label: "Timezone",
      value: userData.profile?.timezone || "Not set",
      icon: Clock3,
    },
    {
      label: "Locale",
      value: userData.profile?.locale || "en-US",
      icon: MapPin,
    },
  ];

  const wellnessNotes = [
    "Small, consistent check-ins often work better than waiting for the perfect moment.",
    "A quiet five-minute reset still counts as meaningful self-care.",
    "Your therapist can help adjust the pace whenever life feels heavy.",
  ];

  return (
    <ClientLayout>
      <div className="space-y-3 pb-24 sm:space-y-6 lg:space-y-8 lg:pb-0">
        <section className="overflow-hidden rounded-[1.2rem] border border-teal-100 bg-white shadow-[0_10px_24px_rgba(15,118,110,0.06)] lg:hidden">
          <div className="bg-[linear-gradient(180deg,_#daf7f5_0%,_#eef9f7_100%)] pb-2.5 pt-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-700/80">
                  My profile
                </p>
                <h1 className="mt-0.5 text-[1.75rem] font-semibold tracking-tight text-slate-950">
                  {userData.profile?.firstName || "Client"}{" "}
                  {userData.profile?.lastName || ""}
                </h1>
                <p className="mt-0.5 max-w-[16rem] text-[13px] leading-6 text-slate-600">
                  Your care details, next steps, and account tools in one calm place.
                </p>
              </div>
              <Link href="/client/settings">
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white text-teal-700 shadow-sm hover:bg-white"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="mt-2.5 rounded-[1.05rem] bg-white/90 p-2.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-base font-semibold text-white shadow-md">
                  {userData.profile?.firstName?.[0] || "C"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-slate-950">
                    {userData.profile?.firstName || "Client"}{" "}
                    {userData.profile?.lastName || ""}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">{userData.email}</p>
                  <div className="mt-1 inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-medium text-teal-700">
                    Profile complete: {profileCompletion}%
                  </div>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                {accountItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-[0.9rem] bg-slate-50 px-2 py-1.5">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                        <Icon className="h-3 w-3" />
                      </div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-0.5 break-words text-[11px] leading-4.5 text-slate-700">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="hidden overflow-hidden rounded-[2rem] border border-teal-100 bg-[linear-gradient(135deg,_#f0fdfa_0%,_#ecfeff_42%,_#fdf2f8_100%)] shadow-[0_20px_60px_rgba(15,118,110,0.10)] lg:block">
          <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)] lg:px-8">
            <div className="space-y-4">
              <Badge className="w-fit rounded-full bg-white/90 px-3 py-1 text-teal-700 shadow-sm">
                Your care space
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Welcome back, {userData.profile?.firstName || "there"}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Keep track of upcoming appointments, stay organized, and pick up your next step in therapy without digging through menus.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/client/therapists">
                  <Button className="min-h-11 rounded-full bg-teal-600 px-5 text-white hover:bg-teal-700">
                    Find a therapist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/client/appointments">
                  <Button
                    variant="outline"
                    className="min-h-11 rounded-full border-white/80 bg-white/70 px-5 text-slate-800 hover:bg-white"
                  >
                    View appointments
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-950">
                  <HeartHandshake className="h-5 w-5 text-teal-600" />
                  Next care checkpoint
                </CardTitle>
                <CardDescription>
                  Your nearest session and what to do next.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingAppointments ? (
                  <LoadingSpinner size="md" text="Checking your schedule..." />
                ) : nextAppointment ? (
                  <>
                    <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
                      <p className="text-sm font-medium text-teal-700">Upcoming session</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">
                        {formatAppointmentDate(nextAppointment.scheduledFor)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatAppointmentTime(nextAppointment.scheduledFor)}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Set aside a few quiet minutes before your session so you can arrive grounded.</p>
                      <p>Your session link and history stay available from your appointments area.</p>
                    </div>
                    <Link href="/client/appointments" className="block">
                      <Button className="min-h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                        Open appointments
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                      <Calendar className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-3 text-sm font-medium text-slate-900">
                        No upcoming sessions yet
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Browse therapists and book when you&apos;re ready.
                      </p>
                    </div>
                    <Link href="/client/therapists" className="block">
                      <Button className="min-h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800">
                        Explore therapists
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="overflow-hidden border border-slate-200/80 bg-white shadow-sm"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 sm:text-sm">{stat.label}</p>
                      <p className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone} text-white shadow-sm sm:h-12 sm:w-12`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-600 sm:mt-4 sm:text-sm sm:leading-6">
                    {stat.helper}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-xl text-slate-950">Upcoming appointments</CardTitle>
                <CardDescription>
                  Your next therapy sessions at a glance.
                </CardDescription>
              </div>
              <Link href="/client/appointments">
                <Button
                  variant="outline"
                  className="min-h-10 rounded-full border-slate-200 px-4"
                >
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="py-12">
                  <LoadingSpinner size="lg" text="Loading appointments..." />
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 4).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                          <Video className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-950">Therapy session</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                            <span>{formatAppointmentDate(appointment.scheduledFor)}</span>
                            <span>{formatAppointmentTime(appointment.scheduledFor)}</span>
                            <span className="capitalize">{appointment.status}</span>
                          </div>
                        </div>
                      </div>
                      <Link href="/client/appointments">
                        <Button
                          variant="outline"
                          className="min-h-10 w-full rounded-xl border-slate-200 sm:w-auto"
                        >
                          Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    Nothing scheduled right now
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    When you&apos;re ready, browse available therapists and book your next session.
                  </p>
                  <Link href="/client/therapists" className="mt-5 inline-block">
                    <Button className="rounded-full bg-teal-600 px-5 text-white hover:bg-teal-700">
                      Find a therapist
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="order-first space-y-5 xl:order-none">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">Quick actions</CardTitle>
                <CardDescription>Jump into the tasks you use most.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Link href="/client/therapists" className="block">
                  <Button
                    variant="outline"
                    className="min-h-12 w-full justify-start rounded-2xl border-slate-200 px-4 text-left"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Browse therapists
                  </Button>
                </Link>
                <Link href="/client/appointments" className="block">
                  <Button
                    variant="outline"
                    className="min-h-12 w-full justify-start rounded-2xl border-slate-200 px-4 text-left"
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    Manage appointments
                  </Button>
                </Link>
                <Link href="/client/invoices" className="block">
                  <Button
                    variant="outline"
                    className="min-h-12 w-full justify-start rounded-2xl border-slate-200 px-4 text-left"
                  >
                    <FileText className="mr-3 h-4 w-4" />
                    Review invoices
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hidden border border-slate-200 bg-white shadow-sm lg:block">
              <CardHeader>
                <CardTitle className="text-xl text-slate-950">Account snapshot</CardTitle>
                <CardDescription>Your key details at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {accountItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                          {item.label}
                        </p>
                        <p className="mt-1 break-words text-sm text-slate-700">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.95fr)]">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Steady care reminders</CardTitle>
              <CardDescription>
                A few gentle prompts to support your routine between sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {wellnessNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-4 text-sm leading-6 text-slate-700"
                >
                  {note}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-slate-200 bg-[linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_52%,_#fefce8_100%)] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">A small reminder for today</CardTitle>
              <CardDescription>
                Progress in therapy often comes from consistency, not perfection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-900">
                  Showing up for yourself counts, even on quieter days.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use this dashboard to keep the practical side simple, so your energy can stay with the care itself.
                </p>
              </div>
              <Link href="/client/settings" className="block">
                <Button
                  variant="outline"
                  className="min-h-11 w-full rounded-xl border-white/80 bg-white/70 text-slate-900 hover:bg-white"
                >
                  Update profile settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </ClientLayout>
  );
}
