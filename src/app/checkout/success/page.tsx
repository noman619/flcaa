import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Receipt } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getWriteClient, fulfillOrder } from "@/lib/fulfillment";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order complete",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const [{ order_id: orderId }, user] = await Promise.all([
    searchParams,
    requireUser("/dashboard"),
  ]);
  if (!orderId) notFound();

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(unit_price_cents, course:courses(id, slug, title))")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  /*
   * Belt and braces: the Stripe webhook normally fulfils the order, but if the
   * student lands here first (or Stripe is not configured) we fulfil inline.
   * fulfillOrder is idempotent so double-fulfilment is a no-op.
   */
  let fulfilmentError: string | null = null;
  if (order.status === "paid" || order.status === "pending") {
    try {
      const db = await getWriteClient();
      await fulfillOrder(db, order.id);
    } catch (error) {
      fulfilmentError =
        error instanceof Error ? error.message : "Could not finish enrolling you.";
    }
  }

  const items = (order.order_items ?? []) as unknown as {
    unit_price_cents: number;
    course: { id: string; slug: string; title: string } | null;
  }[];

  return (
    <div className="container-page max-w-3xl py-16 lg:py-24">
      <div className="text-center">
        <span className="icon-tile icon-tile-xl mx-auto mb-6 bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h1 className="font-display text-3xl lg:text-4xl">You&apos;re enrolled</h1>
        <p className="mt-3 text-base text-ink-500">
          Order confirmed on {formatDate(order.created_at)}. Everything below is
          already in your dashboard.
        </p>
      </div>

      {fulfilmentError ? (
        <Alert tone="error" title="We took the order but couldn't enrol you" className="mt-8">
          {fulfilmentError} Contact support and quote order{" "}
          <strong>{order.id.slice(0, 8)}</strong>.
        </Alert>
      ) : null}

      <div className="mt-10 rounded-card border border-ink-200 bg-white shadow-card">
        <div className="flex items-center gap-2.5 border-b border-ink-100 px-6 py-4">
          <Receipt className="size-4 text-ink-400" aria-hidden />
          <h2 className="font-display text-base">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h2>
        </div>
        <ul className="divide-y divide-ink-100">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-900">
                  {item.course?.title ?? "Course"}
                </p>
                {item.course ? (
                  <Link
                    href={`/courses/${item.course.slug}`}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    View course page
                  </Link>
                ) : null}
              </div>
              <p className="shrink-0 text-sm font-medium">
                {formatPrice(item.unit_price_cents)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-ink-200 px-6 py-4">
          <span className="font-display text-base">Total paid</span>
          <span className="font-display text-xl">
            {formatPrice(order.total_cents)}
          </span>
        </div>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/dashboard" size="lg">
          Go to my dashboard
          <ArrowRight aria-hidden />
        </ButtonLink>
        <ButtonLink href="/dashboard/orders" size="lg" variant="outline">
          View order history
        </ButtonLink>
      </div>

      <p className="mt-8 text-center text-xs text-ink-400">
        A receipt has been recorded on your account. Need help?{" "}
        <Link href="/contact" className="underline hover:text-ink-700">
          Contact support
        </Link>
        .
      </p>
    </div>
  );
}
