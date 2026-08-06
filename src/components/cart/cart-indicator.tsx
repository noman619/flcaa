"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartIndicator({ className }: { className?: string }) {
  const { count, ready } = useCart();
  return (
    <Link
      href="/cart"
      className={
        className ??
        "relative inline-flex size-10 items-center justify-center rounded-icon text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
      }
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
    >
      <ShoppingCart className="size-5" aria-hidden />
      {ready && count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-medium text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
