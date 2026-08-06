import * as React from "react";
import Image from "next/image";

/**
 * Header tints, cycled in order. The original gives each block its own ribbon
 * colour; one table here keeps that sequence in a single place.
 */
const TONES = [
  "bg-brand-900",
  "bg-brand-600",
  "bg-accent-600",
  "bg-gold-600",
] as const;

export type TopicBlock = {
  title: string;
  /** Ribbon mark. The original's own artwork, hence an image not an icon font. */
  icon?: { src: string; width: number; height: number };
  body: readonly React.ReactNode[];
  /** Bulleted list under the prose. */
  bullets?: readonly React.ReactNode[];
  /** Paragraphs after the list, where a block qualifies it. */
  footer?: readonly React.ReactNode[];
  /** Chart or table shown beside the prose. */
  media?: React.ReactNode;
};

/**
 * A run of illustrated topic cards — ribbon head, artwork on one side, prose
 * on the other.
 *
 * Media alternates sides down the run so consecutive cards do not read as one
 * column of pictures with one column of text, which is what makes a long run
 * of these feel like a slide deck. Where a block has no media the prose simply
 * takes the full width.
 */
export function TopicBlocks({
  title,
  intro,
  items,
}: {
  /** Heading above the run, where the section has one. */
  title?: string;
  intro?: string;
  items: readonly TopicBlock[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-sand-100">
      <div className="container-page space-y-10 py-16 lg:space-y-14 lg:py-24">
        {title ? (
          <div className="reveal mx-auto max-w-3xl text-center">
            <h2 className="font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
              {title}
            </h2>
            {intro ? (
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                {intro}
              </p>
            ) : null}
          </div>
        ) : null}

        {items.map((item, i) => (
          <article
            key={item.title}
            className="reveal overflow-hidden rounded-panel border border-ink-200/60 bg-white shadow-card"
          >
            <header
              className={`flex items-center gap-4 px-6 py-4 lg:px-8 ${TONES[i % TONES.length]}`}
            >
              {item.icon ? (
                <Image
                  src={item.icon.src}
                  alt=""
                  width={item.icon.width}
                  height={item.icon.height}
                  className="size-9 shrink-0 object-contain"
                />
              ) : null}
              <h2 className="text-[13px] font-medium tracking-[0.16em] text-white uppercase lg:text-sm">
                {item.title}
              </h2>
            </header>

            <div
              className={
                item.media
                  ? "grid gap-8 p-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10"
                  : "p-6 lg:p-10"
              }
            >
              {item.media ? (
                <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  {item.media}
                </div>
              ) : null}

              <div className="min-w-0 space-y-4">
                {item.body.map((paragraph, bi) => (
                  <p
                    key={bi}
                    className="text-[15px] leading-relaxed text-ink-600"
                  >
                    {paragraph}
                  </p>
                ))}

                {item.bullets?.length ? (
                  <ul className="space-y-3 pt-1">
                    {item.bullets.map((bullet, bi) => (
                      <li key={bi} className="flex items-start gap-3">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600"
                          aria-hidden
                        />
                        <span className="text-[15px] leading-relaxed text-ink-700">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.footer?.map((paragraph, fi) => (
                  <p
                    key={fi}
                    className="text-[15px] leading-relaxed text-ink-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Chart artwork inside a topic card. Plain figure, no frame: these are already
 * rendered charts on a white field, so a border would double the edge.
 */
export function TopicChart({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="h-auto w-full rounded-card"
    />
  );
}

/** Two-column figures inside a topic card. */
export function TopicTable({
  columns,
  rows,
  caption,
}: {
  columns: readonly [string, string];
  rows: readonly (readonly [string, string])[];
  caption: string;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-ink-200/70">
      <table className="w-full min-w-72 border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-sand-100">
            {columns.map((column, i) => (
              <th
                key={column}
                scope="col"
                className={`px-5 py-3 text-[11px] font-medium tracking-[0.14em] text-ink-500 uppercase ${
                  i === 1 ? "text-right" : ""
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-200/70">
          {rows.map(([label, value], i) => (
            <tr
              key={`${label}-${i}`}
              className="transition-colors duration-200 hover:bg-sand-50"
            >
              <th
                scope="row"
                className="px-5 py-3 text-[14.5px] font-normal text-ink-700"
              >
                {label}
              </th>
              <td className="px-5 py-3 text-right text-[14.5px] font-medium text-ink-900 tabular-nums">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
