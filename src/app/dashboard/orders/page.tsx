import type { Metadata } from "next";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Order history",
  robots: { index: false, follow: false },
};

const STATUS_TONE: Record<OrderStatus, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "neutral",
  canceled: "neutral",
};

export default async function OrdersPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select(
      "id, status, total_cents, coupon_code, created_at, order_items(unit_price_cents, course:courses(slug, title))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as unknown as {
    id: string;
    status: OrderStatus;
    total_cents: number;
    coupon_code: string | null;
    created_at: string;
    order_items: {
      unit_price_cents: number;
      course: { slug: string; title: string } | null;
    }[];
  }[];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Order history</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Every purchase on your account, with what it included.
        </p>
      </header>

      {orders.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No orders yet"
          description="Once you buy a course it will appear here with a full receipt."
          action={<ButtonLink href="/courses">Browse courses</ButtonLink>}
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="overflow-hidden rounded-card border border-ink-200 bg-white shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/60 px-5 py-3.5">
                <div>
                  <p className="font-mono text-xs font-medium text-ink-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {order.coupon_code ? (
                    <Badge variant="accent" size="sm">
                      {order.coupon_code}
                    </Badge>
                  ) : null}
                  <Badge variant={STATUS_TONE[order.status]} size="sm">
                    {order.status}
                  </Badge>
                  <span className="font-display text-base">
                    {formatPrice(order.total_cents)}
                  </span>
                </div>
              </div>
              <ul className="divide-y divide-ink-100">
                {order.order_items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                  >
                    {item.course ? (
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="min-w-0 text-ink-700 hover:underline"
                      >
                        {item.course.title}
                      </Link>
                    ) : (
                      <span className="text-ink-500">Course removed</span>
                    )}
                    <span className="shrink-0 text-ink-500">
                      {formatPrice(item.unit_price_cents)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
