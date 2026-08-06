"use client";

import * as React from "react";

export type CartItem = {
  courseId: string;
  slug: string;
  title: string;
  priceCents: number;
  trackSlug: string;
  hours: number | null;
};

type CartState = {
  items: CartItem[];
  ready: boolean;
  add: (item: CartItem) => void;
  remove: (courseId: string) => void;
  clear: () => void;
  has: (courseId: string) => boolean;
  count: number;
  subtotalCents: number;
};

const STORAGE_KEY = "flca.cart.v1";

/* -------------------------------------------------------------------------
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than mirrored into state via an effect. That
 * keeps the server snapshot empty (no hydration mismatch) and keeps every
 * open tab in sync for free.
 * ---------------------------------------------------------------------- */

const EMPTY: CartItem[] = [];
let snapshot: CartItem[] = EMPTY;
let snapshotSource: string | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === "object" &&
        i !== null &&
        typeof (i as CartItem).courseId === "string" &&
        typeof (i as CartItem).priceCents === "number",
    );
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartItem[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  // Cache by raw string so repeated reads return a referentially stable array.
  if (raw !== snapshotSource) {
    snapshotSource = raw;
    snapshot = parse(raw);
  }
  return snapshot;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  for (const listener of listeners) listener();
}

const CartContext = React.createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  // `ready` distinguishes "server render / not hydrated" from "genuinely empty".
  const ready = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const value = React.useMemo<CartState>(
    () => ({
      items,
      ready,
      add: (item) => {
        if (items.some((i) => i.courseId === item.courseId)) return;
        write([...items, item]);
      },
      remove: (courseId) => write(items.filter((i) => i.courseId !== courseId)),
      clear: () => write([]),
      has: (courseId) => items.some((i) => i.courseId === courseId),
      count: items.length,
      subtotalCents: items.reduce((sum, i) => sum + i.priceCents, 0),
    }),
    [items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
