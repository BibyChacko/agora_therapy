import { Providers } from "@/lib/providers";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
