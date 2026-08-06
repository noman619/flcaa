"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCart, type CartItem } from "@/components/cart/cart-provider";

export function AddToCartButton({
  item,
  owned = false,
  size = "lg",
  block = true,
}: {
  item: CartItem;
  owned?: boolean;
  size?: "sm" | "md" | "lg";
  block?: boolean;
}) {
  const cart = useCart();
  const router = useRouter();
  const [added, setAdded] = React.useState(false);

  if (owned) {
    return (
      <ButtonLink
        href="/dashboard"
        variant="outline"
        size={size}
        block={block}
        prefetch={false}
      >
        <Check /> You own this — go to dashboard
      </ButtonLink>
    );
  }

  if (!cart.ready) {
    return (
      <Button size={size} block={block} disabled>
        <Loader2 className="animate-spin" /> Loading…
      </Button>
    );
  }

  const inCart = cart.has(item.courseId);

  if (inCart) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          size={size}
          block={block}
          variant="accent"
          onClick={() => router.push("/cart")}
        >
          <ShoppingCart /> In cart — view cart
        </Button>
        <button
          type="button"
          onClick={() => cart.remove(item.courseId)}
          className="text-xs text-ink-500 underline underline-offset-4 hover:text-ink-800"
        >
          Remove from cart
        </button>
      </div>
    );
  }

  return (
    <Button
      size={size}
      block={block}
      onClick={() => {
        cart.add(item);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
    >
      {added ? <Check /> : <ShoppingCart />}
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
