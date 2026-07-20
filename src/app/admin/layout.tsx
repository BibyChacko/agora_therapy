import { Providers } from "@/lib/providers";
import AdminLayoutShell from "./AdminLayoutShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </Providers>
  );
}
