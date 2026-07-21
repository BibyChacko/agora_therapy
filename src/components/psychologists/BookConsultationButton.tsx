import Link from "next/link";

interface BookConsultationButtonProps {
  psychologistId: string;
}

export function BookConsultationButton({ psychologistId }: BookConsultationButtonProps) {
  const bookingPath = `/booking/${psychologistId}`;

  const buttonClasses =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-3 text-center text-base font-bold text-white shadow-md transition-opacity hover:opacity-90";

  return (
    <Link href={bookingPath} className={buttonClasses}>
      Book Consultation
    </Link>
  );
}
