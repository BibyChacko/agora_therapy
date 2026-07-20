import { Providers } from "@/lib/providers";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
