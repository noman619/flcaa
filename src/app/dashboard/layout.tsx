import { requireUser } from "@/lib/auth";
import { DashboardNav } from "./dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/dashboard");

  return (
    <div className="min-h-[70vh] bg-mist-50/70">
      <DashboardNav />
      <div className="container-page py-10 lg:py-14">{children}</div>
    </div>
  );
}
