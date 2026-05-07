"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface BookConsultationButtonProps {
  psychologistId: string;
}

export function BookConsultationButton({ psychologistId }: BookConsultationButtonProps) {
  const { user, loading } = useAuth();

  const buttonClasses = "block w-full py-3 px-4 text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity font-bold cursor-pointer";

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
      <Link href={`/booking/${psychologistId}`} className={buttonClasses}>
        Book Consultation
      </Link>
    );
  }

  return (
    <AuthDialog redirectUrl={`/booking/${psychologistId}`}>
      <button className={buttonClasses}>
        Book Consultation
      </button>
    </AuthDialog>
  );
}
