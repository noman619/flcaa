"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, CreditCard, Gift, MailCheck, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { trackTheme } from "@/lib/catalog";
import { formatHours, formatPrice } from "@/lib/utils";
import {
  PROMO,
  SALE_LABEL,
  listPriceCents,
  promoDiscountCents,
  saleDiscountCents,
} from "@/lib/promo";
import { MoneyBackBadge } from "@/components/ui/money-back-badge";
import { getCartPrices, setEmailOptIn } from "./actions";
import { Input } from "@/components/ui/input";

export function CartView({
  isAuthed,
  canceled,
  email,
  emailOptIn,
}: {
  isAuthed: boolean;
  canceled: boolean;
  email: string;
  emailOptIn: boolean;
}) {
  const cart = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = React.useState("");
  const [emailInput, setEmailInput] = React.useState(email);
  const [optIn, setOptIn] = React.useState(emailOptIn);

  /*
   * Live catalog prices, keyed by course id.
   *
   * The stored cart carries the price as it was when the item was added, so a
   * cart that outlives a price change shows the old figure — and the promotion
   * is then taken off that stale number. Checkout re-prices from the database,
   * so the two disagreed. Re-reading here keeps the cart honest without asking
   * anyone to empty it.
   */
  const [livePrices, setLivePrices] = React.useState<Record<string, number>>({});
  const ids = cart.items
    .map((i) => i.courseId)
    .sort()
    .join(",");

  React.useEffect(() => {
    if (!ids) return;
    let active = true;
    void getCartPrices(ids.split(",")).then((prices) => {
      if (active) setLivePrices(prices);
    });
    return () => {
      active = false;
    };
  }, [ids]);

  /** Catalog price where we have one, the stored snapshot until then. */
  const priceOf = (item: { courseId: string; priceCents: number }) =>
    livePrices[item.courseId] ?? item.priceCents;

  const priced = cart.items.map((i) => ({
    slug: i.slug,
    unitPriceCents: priceOf(i),
  }));

  /*
   * The subtotal is struck at LIST price, so the saving a landing page
   * advertises is visible here too. For everything without an anchor the list
   * price is the price, and the two lines collapse to one.
   */
  const subtotalCents = priced.reduce(
    (sum, i) => sum + listPriceCents(i.slug, i.unitPriceCents),
    0,
  );
  const saleDiscount = saleDiscountCents(priced);

  // Mirrors the server calculation in priceCart so the cart and the checkout
  // agree; the server figure is still the one that gets charged.
  const promoDiscount = promoDiscountCents(priced);
  const totalCents = subtotalCents - saleDiscount - promoDiscount;
  const discounted = saleDiscount > 0 || promoDiscount > 0;

  if (!cart.ready) {
    return (
      <div className="h-64 animate-pulse rounded-card border border-ink-200 bg-ink-50" />
    );
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the catalog and add a course — you can enrol in seconds."
        action={
          <ButtonLink href="/courses">
            Browse courses <ArrowRight aria-hidden />
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-4">
        {canceled ? (
          <Alert tone="warning" title="Checkout canceled">
            Nothing was charged. Your cart is exactly as you left it.
          </Alert>
        ) : null}

        <ul className="space-y-4">
          {cart.items.map((item) => {
            const theme = trackTheme(item.trackSlug);
            const hours = formatHours(item.hours);
            return (
              <li
                key={item.courseId}
                className="flex gap-4 rounded-card border border-ink-200 bg-white p-5 shadow-card"
              >
                <span
                  className="w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base leading-snug">
                    <Link
                      href={`/courses/${item.slug}`}
                      className="hover:underline"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-1.5 flex items-center gap-3 text-xs text-ink-500">
                    {hours ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden />
                        {hours}
                      </span>
                    ) : null}
                    <span>Self-paced online</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => cart.remove(item.courseId)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Remove
                  </button>
                </div>
                <p className="shrink-0 text-right">
                  {(() => {
                    const price = priceOf(item);
                    const list = listPriceCents(item.slug, price);
                    return (
                      <>
                        {list > price ? (
                          <span className="mr-2 text-sm text-ink-400 line-through">
                            {formatPrice(list)}
                          </span>
                        ) : null}
                        <span className="font-display text-lg">
                          {price === 0 ? "Free" : formatPrice(price)}
                        </span>
                      </>
                    );
                  })()}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-ink-600">
            Looking for more?{" "}
            <Link
              href="/courses"
              className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900"
            >
              Continue shopping
            </Link>
          </p>
          <Button variant="ghost" size="sm" onClick={cart.clear}>
            Clear cart
          </Button>
        </div>

        <MoneyBackBadge className="mt-2" />
      </div>

      <aside className="rounded-card border border-ink-200 bg-white p-6 shadow-card lg:sticky lg:top-28">
        <h2 className="font-display text-lg">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">
              {cart.count} item{cart.count === 1 ? "" : "s"}
            </dt>
            <dd className="font-medium">{formatPrice(subtotalCents)}</dd>
          </div>
          {saleDiscount > 0 ? (
            <div className="flex justify-between text-leaf-700">
              <dt>{SALE_LABEL}</dt>
              <dd>−{formatPrice(saleDiscount)}</dd>
            </div>
          ) : null}
          {promoDiscount > 0 ? (
            <div className="flex justify-between text-leaf-700">
              <dt>{PROMO.label}</dt>
              <dd>−{formatPrice(promoDiscount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-ink-100 pt-3">
            <dt className="font-display text-base">
              {discounted ? "Total" : "Subtotal"}
            </dt>
            <dd className="font-display text-xl">{formatPrice(totalCents)}</dd>
          </div>
        </dl>
        {/* Promo coupon. The code is carried to checkout, which is where the
            server prices it — the cart never decides a discount itself. */}
        <form
          className="mt-6 border-t border-ink-100 pt-5"
          onSubmit={(event) => {
            event.preventDefault();
            const code = coupon.trim();
            router.push(
              code
                ? "/checkout?coupon=" + encodeURIComponent(code)
                : "/checkout",
            );
          }}
        >
          <h3 className="font-display text-sm">Apply a promo coupon</h3>
          <div className="mt-3 flex gap-2">
            <label htmlFor="promo-coupon" className="sr-only">
              Promo coupon
            </label>
            <span className="flex items-center text-ink-400">
              <Gift className="size-4" aria-hidden />
            </span>
            <Input
              id="promo-coupon"
              name="coupon"
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              placeholder="Promo coupon"
              className="h-9 flex-1 text-sm"
            />
            <Button type="submit" variant="link" className="text-accent-600">
              Redeem
            </Button>
          </div>
        </form>

        {/* Checkout contact block, as on the original cart. */}
        <div className="mt-6 border-t border-ink-100 pt-5">
          <h3 className="font-display text-base">Checkout</h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            Enter your email address. This address will be used to send you
            order status updates.
          </p>

          <label htmlFor="checkout-email" className="sr-only">
            Your email address
          </label>
          <Input
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            placeholder="Your email address"
            readOnly={isAuthed}
            className="mt-3"
          />
          {isAuthed ? (
            <p className="mt-1.5 text-xs text-ink-400">
              Your account email. Change it in{" "}
              <Link href="/dashboard/settings" className="underline">
                settings
              </Link>
              .
            </p>
          ) : null}

          <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(event) => {
                const next = event.target.checked;
                setOptIn(next);
                // Only signed-in visitors have somewhere to store this.
                if (isAuthed) void setEmailOptIn(next);
              }}
              className="size-4 accent-accent-600"
            />
            Get Notifications by Email
          </label>
        </div>

        <div className="mt-6">
          {isAuthed ? (
            <ButtonLink href="/checkout" size="lg" block>
              Proceed to checkout
              <ArrowRight aria-hidden />
            </ButtonLink>
          ) : (
            <div className="space-y-3">
              <ButtonLink
                href={
                  emailInput.trim()
                    ? `/login?next=%2Fcheckout&email=${encodeURIComponent(emailInput.trim())}`
                    : "/login?next=%2Fcheckout"
                }
                size="lg"
                block
              >
                Log in to check out
              </ButtonLink>
              <p className="text-center text-xs text-ink-500">
                Need help accessing your account?{" "}
                <Link href="/contact" className="font-medium text-brand-700 underline">
                  Contact us
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* What happens after this page, mirroring the original checkout. */}
        <div className="mt-8 border-t border-ink-100 pt-6">
          <h3 className="font-display text-base">Next</h3>
          <ol className="mt-4 space-y-4">
            <li className="flex gap-3">
              <span className="icon-tile mt-0.5 size-8">
                <CreditCard className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink-900">
                  Payment information
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  Choose a payment method and enter your credentials.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="icon-tile mt-0.5 size-8">
                <MailCheck className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink-900">
                  Order confirmation
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                  Place your order and receive a confirmation email.
                </span>
              </span>
            </li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
