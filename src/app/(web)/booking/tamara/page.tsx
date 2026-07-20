"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

type BookingReturnStatus = "loading" | "confirmed" | "cancelled" | "failed" | "pending";

export default function TamaraBookingReturnPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const status = searchParams.get("status");
  const [bookingStatus, setBookingStatus] = useState<BookingReturnStatus>("loading");
  const [message, setMessage] = useState("Checking your payment status...");

  useEffect(() => {
    if (!appointmentId) {
      setBookingStatus("failed");
      setMessage("We could not find your booking reference.");
      return;
    }

    if (status === "cancel") {
      setBookingStatus("cancelled");
      setMessage("Your Tamara checkout was cancelled before the booking was confirmed.");
      return;
    }

    if (status === "failure") {
      setBookingStatus("failed");
      setMessage("Tamara could not complete the payment. Please try again.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const pollStatus = async () => {
      attempts += 1;

      try {
        const response = await fetch(`/api/bookings/${appointmentId}/status`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load booking status");
        }

        if (data.status === "confirmed" && data.paymentStatus === "paid") {
          if (!cancelled) {
            setBookingStatus("confirmed");
            setMessage("Your booking has been confirmed successfully.");
          }
          return;
        }

        if (attempts >= 10) {
          if (!cancelled) {
            setBookingStatus("pending");
            setMessage(
              "Your payment was received and the booking is still being confirmed. Please check My Appointments in a moment."
            );
          }
          return;
        }

        window.setTimeout(pollStatus, 3000);
      } catch (error) {
        if (!cancelled) {
          setBookingStatus("failed");
          setMessage(
            error instanceof Error
              ? error.message
              : "We could not verify the booking status."
          );
        }
      }
    };

    void pollStatus();

    return () => {
      cancelled = true;
    };
  }, [appointmentId, status]);

  const title = useMemo(() => {
    switch (bookingStatus) {
      case "confirmed":
        return "Booking Confirmed";
      case "cancelled":
        return "Checkout Cancelled";
      case "pending":
        return "Payment Processing";
      case "failed":
        return "Payment Not Completed";
      default:
        return "Checking Payment";
    }
  }, [bookingStatus]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_28%),linear-gradient(180deg,_#f7fbff_0%,_#ffffff_65%,_#f8fcff_100%)] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        {bookingStatus === "loading" && (
          <div className="mb-6 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{message}</p>

        {appointmentId && (
          <p className="mt-4 text-sm text-slate-500">
            Booking reference: <span className="font-medium text-slate-700">{appointmentId}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/client/appointments">
            <Button className="rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 text-white hover:opacity-95">
              View My Appointments
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-2xl px-6">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
