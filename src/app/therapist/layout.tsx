import { Providers } from "@/lib/providers";

export default function TherapistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
