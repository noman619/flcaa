"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/cart/cart-provider";

/**
 * "Enroll Now" on a pricing plan: puts the course in our own cart and goes to
 * /cart, mirroring the original site's flow (its button lands the visitor on a
 * cart with the plan already in it) without leaving this app.
 *
 * A real <Link>, not a button: the cart only becomes readable after hydration
 * reads localStorage, and gating on that rendered the primary CTA as a disabled
 * "Loading…" in the server HTML — invisible to crawlers and a flash for users.
 * As a link it is present and clickable immediately; the click handler adds the
 * item when the cart is ready, and navigation happens either way.
 *
 * The item carries the catalog's price, not the plan's display price — the cart
 * and checkout must agree with what the server will actually charge.
 */
export function EnrollButton({
  item,
  label = "Enroll Now",
}: {
  item: CartItem;
  /** The original labels this "Add to Cart" on single-product pages. */
  label?: string;
}) {
  const cart = useCart();

  return (
    <Link
      href="/cart"
      className={buttonVariants({ block: true, tracked: true })}
      onClick={() => {
        if (cart.ready) cart.add(item);
      }}
    >
      {label}
    </Link>
  );
}
