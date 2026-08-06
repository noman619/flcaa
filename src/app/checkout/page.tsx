import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { STRIPE_ENABLED } from "@/lib/env";
import { CheckoutView } from "./checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ coupon?: string }>;
}) {
  const user = await requireUser("/checkout");
  // Carried over from the cart's "Apply a promo coupon" field.
  const { coupon } = await searchParams;

  return (
    <div className="container-page py-12 lg:py-16">
      <h1 className="font-display text-3xl lg:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-ink-500">
        Signed in as {user.email}. Courses appear in your dashboard immediately
        after payment.
      </p>
      <div className="mt-10">
        <CheckoutView stripeEnabled={STRIPE_ENABLED} initialCoupon={coupon ?? ""} />
      </div>
    </div>
  );
}
