import Image from "next/image";
import { EnrollButton } from "@/components/course/enroll-button";
import type { CartItem } from "@/components/cart/cart-provider";

/** Tag tints, keyed by the label the storefront uses. */
const TAG_TONES: Record<string, string> = {
  blue: "bg-brand-500",
  red: "bg-accent-500",
  // No purple in the palette; the gold is the site's fourth accent.
  purple: "bg-gold-700",
  teal: "bg-leaf-500",
};

export type StoreProduct = {
  name: string;
  price: string;
  /** Struck anchor, where the product is on sale. */
  wasPrice?: string;
  /** Corner flag, e.g. "On Sale". */
  flag?: string;
  /** Category chip over the artwork. */
  tag?: { label: string; tone: keyof typeof TAG_TONES };
  image: string;
  item: CartItem;
};

/**
 * Storefront category listing — one tile per product, price and buy action on
 * every tile.
 *
 * Deliberately flatter than the marketing cards elsewhere on the site: this is
 * a shelf, and a visitor scanning it compares prices across tiles rather than
 * reading any one of them. The artwork sits on a tinted plate because the
 * source images are line drawings on transparent backgrounds.
 */
export function StoreGrid({
  items,
  columns = 6,
}: {
  items: readonly StoreProduct[];
  /**
   * Widest-breakpoint column count. The CAM shelf carries six products, the
   * real estate one five — six columns there would leave a gap at the end of
   * the row rather than a shelf.
   */
  columns?: 5 | 6;
}) {
  return (
    <ul
      className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${
        columns === 5 ? "xl:grid-cols-5" : "xl:grid-cols-6"
      }`}
    >
      {items.map((product) => (
        <li
          /* Name alone is not unique — the RE shelf lists two products called
             "Specialty Credit (4 Hrs)". */
          key={`${product.name}-${product.item.slug}`}
          className="reveal flex flex-col overflow-hidden rounded-panel border border-ink-200/60 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover"
        >
          <div className="relative aspect-square bg-sand-100">
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 16vw, (min-width: 640px) 33vw, 100vw"
              className="object-contain p-4"
            />

            {product.tag ? (
              <span
                className={`absolute top-3 left-3 max-w-[80%] rounded-md px-2.5 py-1 text-[11px] leading-tight font-medium text-white ${TAG_TONES[product.tag.tone]}`}
              >
                {product.tag.label}
              </span>
            ) : null}

            {product.flag ? (
              <span className="absolute top-3 right-3 rounded-md bg-gold-600 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-white uppercase">
                {product.flag}
              </span>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-[15px] leading-snug text-ink-950">
              {product.name}
            </h3>

            <p className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="font-display text-lg text-brand-700">
                {product.price}
              </span>
              {product.wasPrice ? (
                <span className="text-[13px] text-ink-400 line-through">
                  {product.wasPrice}
                </span>
              ) : null}
            </p>

            <div className="mt-4 pt-1">
              <EnrollButton item={product.item} label="Buy Now" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
