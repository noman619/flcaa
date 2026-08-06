import { EnrollButton } from "@/components/course/enroll-button";
import type { CartItem } from "@/components/cart/cart-provider";

/**
 * Panel tints. The original runs the real estate block on blue and the CAM one
 * on green — a returning student recognises their own block by its colour, so
 * the difference is content, not decoration.
 */
const TONES = {
  blue: "bg-linear-to-br from-brand-500 via-brand-600 to-brand-700",
  green: "bg-linear-to-br from-leaf-400 via-leaf-500 to-leaf-600",
} as const;

export type ExtensionProduct = {
  /** Text before the emphasised span, or the whole line where there is none. */
  lead: string;
  /** Emphasised term — "30-day". */
  strong?: string;
  tail?: string;
  price: string;
  item: CartItem | null;
};

/**
 * The extension products on a licence track: two extensions side by side, the
 * re-enrollment centred beneath, on one coloured panel.
 *
 * Glass cards on the panel rather than bare text, so each price reads as an
 * offer with its own action instead of a line in a poster.
 */
export function ExtensionProducts({
  title,
  tone,
  products,
}: {
  title: string;
  tone: keyof typeof TONES;
  products: readonly ExtensionProduct[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <div
          className={`reveal relative overflow-hidden rounded-hero p-8 shadow-pop lg:p-14 ${TONES[tone]}`}
        >
          <span
            className="pointer-events-none absolute -top-24 -right-16 size-112 rounded-full bg-white/15 blur-3xl"
            aria-hidden
          />

          <h2 className="relative text-center font-display text-[1.7rem] leading-tight font-medium text-gold-300 lg:text-[2.2rem]">
            {title}
          </h2>

          <ul className="relative mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2 lg:mt-14">
            {products.map((product, i) => {
              /* The third product sits centred under the pair, as on the
                 original — so on a two-column row it spans both. */
              const wide = i === products.length - 1;

              return (
                <li
                  key={product.price}
                  className={
                    wide
                      ? "sm:col-span-2 sm:mx-auto sm:w-1/2 sm:min-w-64"
                      : undefined
                  }
                >
                  <div className="flex h-full flex-col items-center rounded-panel border border-white/40 bg-white/15 p-6 text-center backdrop-blur-sm transition-[transform,background-color] duration-300 ease-out-soft hover:-translate-y-1 hover:bg-white/25">
                    <p className="text-[15px] leading-snug text-white">
                      {product.lead}
                      {product.strong ? (
                        <>
                          <span className="font-medium">{product.strong}</span>
                          {product.tail}
                        </>
                      ) : null}
                    </p>

                    <p className="mt-3 font-display text-3xl text-white">
                      {product.price}
                    </p>

                    <div className="mt-5 w-full">
                      {product.item ? (
                        <EnrollButton label="Add to Cart" item={product.item} />
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
