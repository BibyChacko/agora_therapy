"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  FileText, 
  Download, 
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { AppointmentService } from "@/lib/services/appointment-service";
import { Appointment } from "@/types/database";
import { useToast } from "@/lib/hooks/useToast";
import { generateInvoicePdf } from "@/lib/utils/invoice-pdf";
import {
  amountFromMinorUnits,
  formatAmountFromMinorUnits,
} from "@/lib/utils/currency";

export default function InvoicesPage() {
  const { user, userData } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.uid) {
      loadInvoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getClientAppointments(user!.uid);
      setAppointments(data);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Load Failed", "Failed to load your invoices");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getTherapistDisplayName = (appointment: Appointment) => {
    return appointment.therapist?.name || appointment.therapistId || "Therapist";
  };

  const getTherapistProfileHref = (appointment: Appointment) => {
    return `/psychologists/${appointment.therapist?.id || appointment.therapistId}`;
  };

  const getTherapistInitial = (appointment: Appointment) => {
    return getTherapistDisplayName(appointment).trim().charAt(0).toUpperCase() || "T";
  };

  const formatInvoiceAmount = (appointment: Appointment) => {
    return formatAmountFromMinorUnits(
      appointment.payment?.amount,
      appointment.payment?.currency
    );
  };

  const getPaymentStatus = (status?: string) => {
    switch (status) {
      case "paid":
        return {
          icon: CheckCircle,
          text: "Paid",
          color: "bg-green-100 text-green-800",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "failed":
        return {
          icon: XCircle,
          text: "Failed",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const totalPaid = appointments
    .filter((apt) => apt.payment?.status === "paid")
    .reduce((sum, apt) => sum + amountFromMinorUnits(apt.payment?.amount), 0);

  const totalPending = appointments
    .filter((apt) => apt.payment?.status === "pending")
    .reduce((sum, apt) => sum + amountFromMinorUnits(apt.payment?.amount), 0);

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Invoices</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
            View and download your payment invoices
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <Card className="overflow-hidden rounded-[1.1rem] border border-blue-200/60 bg-white shadow-[0_8px_18px_rgba(37,99,235,0.06)] transition-all duration-300 hover:shadow-lg">
            <CardContent className="px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm sm:h-9 sm:w-9">
                  <FileText className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="mb-0.5 text-[8px] font-semibold uppercase leading-3 tracking-[0.06em] text-gray-500 sm:text-[11px] sm:tracking-[0.08em]">
                    <span className="sm:hidden">Invoices</span>
                    <span className="hidden sm:inline">Total Invoices</span>
                  </p>
                  <p className="text-[0.95rem] font-bold leading-none text-gray-900 sm:text-[1.35rem]">
                    {appointments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[1.1rem] border border-blue-200/60 bg-white shadow-[0_8px_18px_rgba(37,99,235,0.06)] transition-all duration-300 hover:shadow-lg">
            <CardContent className="px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-green-400 to-green-600 shadow-sm sm:h-9 sm:w-9">
                  <CheckCircle className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="mb-0.5 text-[8px] font-semibold uppercase leading-3 tracking-[0.06em] text-gray-500 sm:text-[11px] sm:tracking-[0.08em]">
                    <span className="sm:hidden">Paid</span>
                    <span className="hidden sm:inline">Total Paid</span>
                  </p>
                  <p className="truncate text-[0.82rem] font-bold leading-none text-gray-900 sm:text-[1.2rem]">
                    ${totalPaid.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[1.1rem] border border-blue-200/60 bg-white shadow-[0_8px_18px_rgba(37,99,235,0.06)] transition-all duration-300 hover:shadow-lg">
            <CardContent className="px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm sm:h-9 sm:w-9">
                  <Clock className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                </div>
                <div>
                  <p className="mb-0.5 text-[8px] font-semibold uppercase leading-3 tracking-[0.06em] text-gray-500 sm:text-[11px] sm:tracking-[0.08em]">
                    <span className="sm:hidden">Pending</span>
                    <span className="hidden sm:inline">Total Pending</span>
                  </p>
                  <p className="truncate text-[0.82rem] font-bold leading-none text-gray-900 sm:text-[1.2rem]">
                    ${totalPending.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">All Invoices</h2>
              <p className="text-sm text-gray-600">{appointments.length} total invoices</p>
            </div>
          </div>

          {appointments.length === 0 ? (
            <Card className="border border-blue-200/60 bg-white shadow-sm">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No invoices yet
                </h3>
                <p className="text-gray-600">
                  Your payment invoices will appear here after booking sessions
                </p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => {
              const paymentStatus = getPaymentStatus(appointment.payment?.status);
              const StatusIcon = paymentStatus.icon;

              return (
                <Card
                  key={appointment.id}
                  className="overflow-hidden rounded-[1.4rem] border border-blue-200/60 bg-white shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition-shadow hover:shadow-[0_16px_36px_rgba(37,99,235,0.12)]"
                >
                  <CardContent className="px-4 py-1 sm:px-5 sm:py-1 lg:px-6 lg:py-1">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                              Invoice #{appointment.id.substring(0, 8).toUpperCase()}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {formatDate(appointment.scheduledFor)} at {formatTime(appointment.scheduledFor)}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${paymentStatus.color} rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {paymentStatus.text}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-[1.1rem] bg-slate-50/80 p-3">
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Therapist</p>
                          <Link
                            href={getTherapistProfileHref(appointment)}
                            className="flex items-center gap-2 text-slate-900 transition-colors hover:text-teal-700"
                          >
                            {appointment.therapist?.image ? (
                              <Image
                                src={appointment.therapist.image}
                                alt={getTherapistDisplayName(appointment)}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-semibold text-white">
                                {getTherapistInitial(appointment)}
                              </div>
                            )}
                            <span className="min-w-0 font-medium leading-5">
                              {getTherapistDisplayName(appointment)}
                            </span>
                          </Link>
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Session Type</p>
                          <p className="font-medium capitalize text-slate-900">
                            {appointment.session?.type || "Individual"}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Duration</p>
                          <p className="font-medium text-slate-900">{appointment.duration} min</p>
                        </div>
                        <div className="min-w-0">
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Amount</p>
                          <p className="text-lg font-bold text-slate-900">
                            {formatInvoiceAmount(appointment)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-white px-3 py-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Payment
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {appointment.payment?.currency?.toUpperCase() || "USD"} invoice ready
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDownloadInvoice(appointment)}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0 rounded-xl border-blue-200 hover:bg-blue-50"
                          aria-label={`Download invoice ${appointment.id.substring(0, 8).toUpperCase()}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
