import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatShortDate } from "@/lib/utils";
import type { OrderStatus } from "@/lib/database.types";

const TONE: Record<OrderStatus, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "neutral",
  canceled: "neutral",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select(
      "id, status, total_cents, coupon_code, stripe_session_id, created_at, user:profiles(full_name), order_items(course:courses(title))",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const orders = (data ?? []) as unknown as {
    id: string;
    status: OrderStatus;
    total_cents: number;
    coupon_code: string | null;
    stripe_session_id: string | null;
    created_at: string;
    user: { full_name: string | null } | null;
    order_items: { course: { title: string } | null }[];
  }[];

  const paidTotal = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total_cents, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Most recent {orders.length} orders.
          </p>
        </div>
        <div className="rounded-card border border-ink-200 bg-white px-5 py-3">
          <p className="text-xs tracking-wider text-ink-500 uppercase">
            Paid total
          </p>
          <p className="mt-1 font-display text-2xl text-emerald-700">
            {formatPrice(paidTotal)}
          </p>
        </div>
      </header>

      <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
        <table className="w-full min-w-208 text-sm">
          <thead className="bg-ink-50 text-left text-xs tracking-wider text-ink-500 uppercase">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Order</th>
              <th scope="col" className="px-5 py-3 font-medium">Student</th>
              <th scope="col" className="px-5 py-3 font-medium">Items</th>
              <th scope="col" className="px-5 py-3 font-medium">Coupon</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
              <th scope="col" className="px-5 py-3 font-medium">Total</th>
              <th scope="col" className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-ink-50/60">
                <td className="px-5 py-3 font-mono text-xs">
                  #{order.id.slice(0, 8).toUpperCase()}
                  {order.stripe_session_id ? (
                    <span className="mt-0.5 block text-[10px] text-ink-400">
                      Stripe
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-ink-700">
                  {order.user?.full_name ?? "—"}
                </td>
                <td className="px-5 py-3 text-ink-600">
                  {order.order_items
                    .map((i) => i.course?.title)
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="px-5 py-3 text-ink-600">
                  {order.coupon_code ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={TONE[order.status]} size="sm">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 font-medium">
                  {formatPrice(order.total_cents)}
                </td>
                <td className="px-5 py-3 text-xs text-ink-500">
                  {formatShortDate(order.created_at)}
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-ink-500">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
