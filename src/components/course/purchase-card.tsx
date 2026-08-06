import * as React from "react";
import Image from "next/image";
import { Check, ShieldCheck } from "lucide-react";
import { EnrollButton } from "@/components/course/enroll-button";
import type { CartItem } from "@/components/cart/cart-provider";

/**
 * One elevated panel carrying the whole offer: the course media, the price, the
 * buy action and what the price includes.
 *
 * Used where a page sells a single product and the original site puts its price
 * card in the hero rather than in a band further down. SinglePlanPricing stays
 * for the pages that do it the other way.
 *
 * The media sits inside the card rather than above it so the panel reads as one
 * object — a video floating free above a price box looks like two unrelated
 * blocks, which is what the original actually renders.
 */
export function PurchaseCard({
  heading,
  media,
  wasPrice,
  price,
  saveLabel,
  instalment,
  guarantee,
  includesTitle = "This package includes:",
  includes,
  enrollItem,
  ctaLabel,
}: {
  /** Banded head naming the product, where the card carries no media. */
  heading?: string;
  media?: React.ReactNode;
  /** Anchor price, struck through. Omit when there is no discount. */
  wasPrice?: string;
  price: string;
  saveLabel?: string;
  instalment?: string;
  guarantee?: string;
  includesTitle?: string;
  includes: readonly string[];
  enrollItem: CartItem;
  ctaLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-hero bg-white shadow-float ring-1 ring-ink-200/70">
      {/*
        Either a named head or the media, never both: the original uses the
        banded title on cards that sell a bundle and the video on cards that
        sell a single course.
      */}
      {heading ? (
        <p className="bg-linear-to-r from-gold-700 to-gold-500 px-7 py-4 text-center text-[13px] font-medium tracking-[0.2em] text-white uppercase">
          {heading}
        </p>
      ) : null}

      {/* media, seated in its own dark well so the video edge is deliberate */}
      {media ? <div className="bg-brand-950 p-2.5">{media}</div> : null}

      <div className="p-7 lg:p-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {wasPrice ? (
            <span className="text-base text-ink-400 line-through">
              {wasPrice}
            </span>
          ) : null}

          <span className="font-display text-5xl leading-none text-brand-700">
            {price}
          </span>

          {saveLabel ? (
            <span className="rounded-full bg-accent-50 px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-accent-700 uppercase">
              {saveLabel}
            </span>
          ) : null}
        </div>

        {instalment ? (
          <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs leading-relaxed text-ink-500">
            {instalment}
            <Image
              src="/course/klarna.png"
              alt="Klarna"
              width={104}
              height={26}
              className="h-4 w-auto"
            />
          </p>
        ) : null}

        <div className="mt-6">
          <EnrollButton item={enrollItem} label={ctaLabel} />
        </div>

        {guarantee ? (
          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-ink-700">
            <ShieldCheck className="size-4 text-leaf-600" aria-hidden />
            {guarantee}
          </p>
        ) : null}

        <div className="mt-7 border-t border-ink-200/70 pt-6">
          <p className="text-[11px] tracking-[0.18em] text-ink-500 uppercase">
            {includesTitle}
          </p>

          <ul className="mt-4 space-y-3">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-leaf-600"
                  aria-hidden
                />
                <span className="text-[14.5px] leading-relaxed text-ink-800">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
