export type IconFeature = {
  /** Path to a vector. Rendered decoratively — the text carries the meaning. */
  icon: string;
  text: string;
  /** Card title. Its presence turns the item into a bordered card. */
  heading?: string;
};

/** Item width per row count. Flex, not grid, so a short last row centres. */
const BASIS = {
  3: "sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]",
  4: "sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]",
} as const;

/**
 * A row of illustrated selling points.
 *
 * The original pairs each line with its own flat vector and no heading, so the
 * sentence is the whole content — the icon is decoration and takes an empty
 * alt. Items that carry a `heading` become bordered cards instead.
 *
 * Laid out with flex-wrap rather than a grid: a five-item run leaves two on
 * the last row, and grid would strand them at the left edge while flex centres
 * them, which is how the original reads.
 */
export function IconFeatures({
  eyebrow,
  title,
  intro,
  features,
  footnote,
  columns = 4,
}: {
  eyebrow?: string;
  title?: string;
  /** Paragraph under the heading. */
  intro?: string;
  features: readonly IconFeature[];
  footnote?: string;
  columns?: keyof typeof BASIS;
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        {eyebrow || title || intro ? (
          <div className="mx-auto max-w-2xl text-center">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? (
              <h2 className="mt-4 font-display text-[1.9rem] leading-[1.12] text-ink-950 lg:text-[2.4rem]">
                {title}
              </h2>
            ) : null}
            {intro ? (
              <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
                {intro}
              </p>
            ) : null}
          </div>
        ) : null}

        <ul className="mt-14 flex flex-wrap justify-center gap-8 lg:mt-16 lg:gap-10">
          {features.map((feature) => (
            <li
              key={feature.text}
              className={`reveal min-w-0 w-full text-center ${BASIS[columns]} ${
                feature.heading
                  ? "rounded-panel border border-ink-200/60 bg-sand-50 p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
                  : ""
              }`}
            >
              {/* Tile inverts inside a card, so it never sits tone-on-tone. */}
              <span
                className={`mx-auto flex size-20 items-center justify-center rounded-panel ring-1 ring-ink-200/70 ${
                  feature.heading ? "bg-white" : "bg-sand-50"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.icon}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="size-11"
                />
              </span>

              {feature.heading ? (
                <h3 className="mt-5 font-display text-lg text-ink-950">
                  {feature.heading}
                </h3>
              ) : null}

              <p
                className={`text-[15px] leading-relaxed text-ink-700 ${
                  feature.heading ? "mt-3 text-[14.5px]" : "mt-5"
                }`}
              >
                {feature.text}
              </p>
            </li>
          ))}
        </ul>

        {footnote ? (
          <p className="mx-auto mt-14 max-w-2xl text-center font-display text-lg leading-snug text-ink-950 lg:text-xl">
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
