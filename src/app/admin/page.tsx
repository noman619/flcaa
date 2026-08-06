import Link from "next/link";
import {
  BookOpen,
  DollarSign,
  Inbox,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatShortDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type CountableTable = "courses" | "enrollments" | "reviews" | "contact_messages";

async function count(table: CountableTable) {
  const supabase = await createClient();
  const { count: value } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });
  return value ?? 0;
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    courseCount,
    enrollmentCount,
    reviewCount,
    contactCount,
    { data: recentOrders },
    { data: pendingReviews },
    { data: unhandled },
  ] = await Promise.all([
    count("courses"),
    count("enrollments"),
    count("reviews"),
    count("contact_messages"),
    supabase
      .from("orders")
      .select("id, total_cents, status, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("reviews")
      .select("id, rating, body, is_published, created_at")
      .eq("is_published", false)
      .limit(5),
    supabase
      .from("contact_messages")
      .select("id, name, subject, created_at")
      .eq("handled", false)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const orders = (recentOrders ?? []) as {
    id: string;
    total_cents: number;
    status: string;
    created_at: string;
    user_id: string;
  }[];

  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total_cents, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Admin overview</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Catalog, enrollments and everything waiting on a staff decision.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BookOpen} label="Courses" value={String(courseCount)} href="/admin/courses" />
        <Stat icon={Users} label="Enrollments" value={String(enrollmentCount)} />
        <Stat icon={Star} label="Reviews" value={String(reviewCount)} href="/admin/reviews" />
        <Stat icon={Inbox} label="Contact messages" value={String(contactCount)} href="/admin/messages" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-ink-200 bg-white">
          <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
            <h2 className="flex items-center gap-2 font-display text-base">
              <TrendingUp className="size-4 text-ink-400" aria-hidden />
              Recent orders
            </h2>
            <Link href="/admin/orders" className="text-xs text-brand-600 hover:underline">
              View all
            </Link>
          </header>
          {orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-500">No orders yet.</p>
          ) : (
            <>
              <ul className="divide-y divide-ink-100">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
                  >
                    <span className="font-mono text-xs text-ink-600">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-ink-400">
                      {formatShortDate(order.created_at)}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        order.status === "paid"
                          ? "success"
                          : order.status === "pending"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="font-medium">{formatPrice(order.total_cents)}</span>
                  </li>
                ))}
              </ul>
              <p className="flex items-center gap-2 border-t border-ink-100 px-5 py-3 text-sm">
                <DollarSign className="size-4 text-emerald-600" aria-hidden />
                <span className="text-ink-500">Paid in this window:</span>
                <strong>{formatPrice(revenue)}</strong>
              </p>
            </>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-card border border-ink-200 bg-white">
            <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
              <h2 className="font-display text-base">
                Reviews awaiting moderation
              </h2>
              <Link href="/admin/reviews" className="text-xs text-brand-600 hover:underline">
                Moderate
              </Link>
            </header>
            {(pendingReviews ?? []).length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-500">
                Nothing waiting.
              </p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {(pendingReviews ?? []).map((review) => (
                  <li key={review.id} className="px-5 py-3 text-sm">
                    <p className="font-medium">{review.rating}★</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">
                      {review.body ?? "No written review"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-card border border-ink-200 bg-white">
            <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
              <h2 className="font-display text-base">
                Unhandled contact messages
              </h2>
              <Link href="/admin/messages" className="text-xs text-brand-600 hover:underline">
                Open inbox
              </Link>
            </header>
            {(unhandled ?? []).length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-500">
                Inbox is clear.
              </p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {(unhandled ?? []).map((message) => (
                  <li key={message.id} className="px-5 py-3 text-sm">
                    <p className="font-medium">{message.name}</p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {message.subject ?? "No subject"} ·{" "}
                      {formatShortDate(message.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-card border border-ink-200 bg-white p-5 transition-shadow hover:shadow-card">
      <Icon className="size-5 text-brand-600" aria-hidden />
      <p className="mt-3 font-display text-3xl">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
