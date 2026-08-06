"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { StoreGrid, type StoreProduct } from "@/components/marketing/store-grid";

/** The storefront's own options, in its order. */
const OPTIONS = [
  { key: "default", label: "Default" },
  { key: "name-asc", label: "Name: A to Z" },
  { key: "name-desc", label: "Name: Z to A" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
] as const;

type SortKey = (typeof OPTIONS)[number]["key"];

/**
 * The shelf with its SORT BY control — the storefront puts one above the grid,
 * right-aligned, and it actually reorders the products.
 *
 * Sorting is done here rather than on the server: the whole shelf is already
 * on the page, so a round trip to reorder five tiles would be a slower answer
 * to a question the client can settle instantly.
 */
export function StoreSortableGrid({
  items,
  columns,
}: {
  items: readonly StoreProduct[];
  columns?: 5 | 6;
}) {
  const [sort, setSort] = React.useState<SortKey>("default");

  const sorted = React.useMemo(() => {
    const list = [...items];
    switch (sort) {
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return list.sort((a, b) => a.item.priceCents - b.item.priceCents);
      case "price-desc":
        return list.sort((a, b) => b.item.priceCents - a.item.priceCents);
      default:
        return list;
    }
  }, [items, sort]);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <label className="group relative inline-flex items-center gap-2">
          <span className="text-[11px] tracking-[0.18em] text-ink-500 uppercase">
            Sort by
          </span>

          <span className="relative inline-flex items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cursor-pointer appearance-none rounded-full border border-ink-200 bg-white py-2 pr-9 pl-4 text-[13px] text-ink-800 transition-colors duration-200 hover:border-ink-300 focus:ring-2 focus:ring-brand-300 focus:outline-none"
            >
              {OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 size-3.5 text-ink-400"
              aria-hidden
            />
          </span>
        </label>
      </div>

      <StoreGrid items={sorted} columns={columns} />
    </>
  );
}
