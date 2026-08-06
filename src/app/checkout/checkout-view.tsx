"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils";

type Quote = {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  promo: { label: string; discountCents: number } | null;
  couponCode: string | null;
  couponError: string | null;
};

export function CheckoutView({
  stripeEnabled,
  initialCoupon = "",
}: {
  stripeEnabled: boolean;
  initialCoupon?: string;
}) {
  const cart = useCart();
  const router = useRouter();

  const [couponInput, setCouponInput] = React.useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [quote, setQuote] = React.useState<Quote | null>(null);
  const [quoting, setQuoting] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const courseIds = React.useMemo(
    () => cart.items.map((i) => i.courseId),
    [cart.items],
  );

  /** Asks the server to price the cart. Returns null when the request fails. */
  const fetchQuote = React.useCallback(
    async (ids: string[], coupon: string | null) => {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: ids, couponCode: coupon }),
      });
      const data = (await res.json()) as Quote & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not price your cart.");
      return data;
    },
    [],
  );

  // Initial pricing pass. All state updates happen after the await, so this
  // never triggers a synchronous cascading render.
  React.useEffect(() => {
    if (!cart.ready || !courseIds.length) return;
    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchQuote(courseIds, null);
        if (cancelled) return;
        setQuote(data);
        setAppliedCoupon(data.couponCode);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Could not reach the server. Check your connection and retry.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cart.ready, courseIds, fetchQuote]);

  /** Re-prices with a coupon. Only ever called from a submit handler. */
  async function applyCoupon(coupon: string | null) {
    setQuoting(true);
    setError(null);
    try {
      const data = await fetchQuote(courseIds, coupon);
      setQuote(data);
      setAppliedCoupon(data.couponCode);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the server. Check your connection and retry.",
      );
    } finally {
      setQuoting(false);
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds, couponCode: appliedCoupon }),
      });
      const data = (await res.json()) as { redirectUrl?: string; error?: string };

      if (!res.ok || !data.redirectUrl) {
        setError(data.error ?? "Checkout could not start. Please try again.");
        setSubmitting(false);
        return;
      }

      cart.clear();
      if (data.redirectUrl.startsWith("http")) {
        window.location.href = data.redirectUrl;
      } else {
        router.push(data.redirectUrl);
      }
    } catch {
      setError("Checkout could not start. Please try again.");
      setSubmitting(false);
    }
  }

  if (!cart.ready) {
    return (
      <div className="h-64 animate-pulse rounded-card border border-ink-200 bg-ink-50" />
    );
  }

  if (!cart.items.length) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nothing to check out"
        description="Add a course to your cart first."
        action={
          <ButtonLink href="/courses">
            Browse courses <ArrowRight aria-hidden />
          </ButtonLink>
        }
      />
    );
  }

  const subtotal = quote?.subtotalCents ?? cart.subtotalCents;
  const discount = quote?.discountCents ?? 0;
  const total = quote?.totalCents ?? cart.subtotalCents;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-6">
        {error ? <Alert tone="error">{error}</Alert> : null}

        {!stripeEnabled ? (
          <Alert tone="warning" title="Test mode — no payment will be taken">
            <code>STRIPE_SECRET_KEY</code> is not set, so this checkout completes
            the order locally and enrols you immediately. Add your Stripe keys to{" "}
            <code>.env.local</code> to take real payments.
          </Alert>
        ) : null}

        <section className="rounded-card border border-ink-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg">
            {cart.count} course{cart.count === 1 ? "" : "s"}
          </h2>
          <ul className="mt-4 divide-y divide-ink-100">
            {cart.items.map((item) => (
              <li
                key={item.courseId}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <span className="min-w-0 text-sm text-ink-700">{item.title}</span>
                <span className="shrink-0 text-sm font-medium">
                  {formatPrice(item.priceCents)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-card border border-ink-200 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg">
            <Tag className="size-4 text-ink-400" aria-hidden />
            Coupon code
          </h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void applyCoupon(couponInput.trim() || null);
            }}
          >
            <label htmlFor="coupon" className="sr-only">
              Coupon code
            </label>
            <Input
              id="coupon"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="SAVE20"
              className="max-w-56"
              autoComplete="off"
            />
            <Button type="submit" variant="outline" disabled={quoting}>
              {quoting ? <Loader2 className="animate-spin" /> : null}
              Apply
            </Button>
          </form>
          {quote?.couponError ? (
            <p className="mt-2.5 text-xs text-red-600" role="alert">
              {quote.couponError}
            </p>
          ) : null}
          {appliedCoupon ? (
            <p className="mt-2.5 text-xs font-medium text-emerald-700">
              Coupon {appliedCoupon} applied — you saved {formatPrice(discount)}.
            </p>
          ) : null}
        </section>
      </div>

      <aside className="rounded-card border border-ink-200 bg-white p-6 shadow-card lg:sticky lg:top-28">
        <h2 className="font-display text-lg">Order total</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {quote?.promo ? (
            <div className="flex justify-between text-leaf-700">
              <dt>{quote.promo.label}</dt>
              <dd>−{formatPrice(quote.promo.discountCents)}</dd>
            </div>
          ) : null}
          {discount - (quote?.promo?.discountCents ?? 0) > 0 ? (
            <div className="flex justify-between text-leaf-700">
              <dt>Coupon {quote?.couponCode}</dt>
              <dd>−{formatPrice(discount - (quote?.promo?.discountCents ?? 0))}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-ink-100 pt-3">
            <dt className="font-display text-base">Total due</dt>
            <dd className="font-display text-2xl">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>

        <Button
          size="lg"
          block
          className="mt-6"
          onClick={submit}
          disabled={submitting || quoting}
        >
          {submitting ? <Loader2 className="animate-spin" /> : <Lock />}
          {submitting
            ? "Starting checkout…"
            : stripeEnabled
              ? "Pay securely"
              : "Complete test order"}
        </Button>

        <p className="mt-4 text-center text-xs leading-relaxed text-ink-400">
          {stripeEnabled
            ? "Payments are processed by Stripe. We never see your card details."
            : "No card required in test mode."}
        </p>
      </aside>
    </div>
  );
}
