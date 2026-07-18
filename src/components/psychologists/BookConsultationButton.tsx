"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

interface BookConsultationButtonProps {
  psychologistId: string;
}

export function BookConsultationButton({ psychologistId }: BookConsultationButtonProps) {
  const { user, loading } = useAuth();
  const bookingPath = `/booking/${psychologistId}`;
  const signInPath = `/login?redirect=${encodeURIComponent(bookingPath)}`;

  const buttonClasses =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-3 text-center text-base font-bold text-white shadow-md transition-opacity hover:opacity-90";

  if (loading) {
    return (
      <button
        disabled
        className={`${buttonClasses} opacity-70 cursor-not-allowed`}
      >
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <Link href={bookingPath} className={buttonClasses}>
        Book Consultation
      </Link>
    );
  }

  return (
    <Link href={signInPath} className={buttonClasses}>
      Book Consultation
    </Link>
  );
}
