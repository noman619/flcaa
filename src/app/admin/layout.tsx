import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { SERVICE_ROLE_AVAILABLE } from "@/lib/supabase/server";
import { Alert } from "@/components/ui/alert";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-[70vh] bg-mist-50/70">
      <AdminNav />
      <div className="container-page space-y-6 py-10 lg:py-12">
        {!SERVICE_ROLE_AVAILABLE ? (
          <Alert tone="warning" title="Service role key not configured">
            Admin writes are falling back to your own session, which RLS limits to
            the policies in <code>supabase_schema.sql</code>. Set{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code> for
            full admin capability and to enable the Stripe webhook.
          </Alert>
        ) : null}
        {children}
      </div>
    </div>
  );
}
