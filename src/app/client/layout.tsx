import { Providers } from "@/lib/providers";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
