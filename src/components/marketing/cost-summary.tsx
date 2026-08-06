import Link from "next/link";

export type CostRow = {
  label: string;
  value: string;
  /** The summed row. Rendered as the table foot, not another body row. */
  total?: boolean;
};

/**
 * "Real Estate License Cost Summary" — the intro, the itemised fees, and the
 * total, on a dark band.
 *
 * A real <table>: these are label/amount pairs with a summed foot, which is
 * tabular data. The original renders it in a fixed-height scroll box that cuts
 * the total row in half; here the table is simply as tall as its contents, and
 * only scrolls sideways on a narrow screen if it has to.
 */
export function CostSummary({
  title,
  titleHref,
  intro,
  rows,
  caption,
  artwork,
}: {
  title: string;
  /** Links the heading, as the original does. */
  titleHref?: string;
  /** Omitted where the page has already set the figures up. */
  intro?: string;
  rows: readonly CostRow[];
  caption?: string;
  /** Decorative illustration beside the table. Hidden below `lg`. */
  artwork?: { src: string };
}) {
  const body = rows.filter((r) => !r.total);
  const total = rows.find((r) => r.total);

  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div
        className="pointer-events-none absolute -right-40 -bottom-40 size-176 rounded-full bg-brand-700/40 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page grid items-center gap-14 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] lg:gap-20 lg:py-28">
        <div className="reveal min-w-0">
          <h2 className="font-display text-[1.9rem] leading-[1.12] font-light text-white lg:text-[2.5rem]">
            {titleHref ? (
              <Link
                href={titleHref}
                className="underline decoration-white/25 underline-offset-[6px] transition-colors duration-200 hover:decoration-white"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>

          {intro ? (
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/65">
              {intro}
            </p>
          ) : null}

          <div className="mt-10 overflow-x-auto rounded-panel ring-1 ring-white/15">
            <table className="w-full min-w-80 border-collapse text-left">
              {caption ? (
                <caption className="sr-only">{caption}</caption>
              ) : null}

              <tbody className="divide-y divide-white/10">
                {body.map((row) => (
                  <tr
                    key={row.label}
                    className="transition-colors duration-200 hover:bg-white/4"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 text-[14.5px] font-normal text-white/80"
                    >
                      {row.label}
                    </th>
                    <td className="px-6 py-4 text-right font-medium text-white tabular-nums whitespace-nowrap">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>

              {total ? (
                <tfoot>
                  <tr className="border-t border-white/25 bg-white/7">
                    <th
                      scope="row"
                      className="px-6 py-5 text-[11px] font-normal tracking-[0.18em] text-white/60 uppercase"
                    >
                      {total.label}
                    </th>
                    <td className="px-6 py-5 text-right font-display text-2xl text-white tabular-nums whitespace-nowrap">
                      {total.value}
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </div>

        {/*
          The original's own calculator artwork, lifted from the inline SVG on
          the source page. A plain <img>, not next/image: the optimizer refuses
          SVG without dangerouslyAllowSVG, and a 6KB vector needs no resizing.
        */}
        {artwork ? (
          <div className="reveal hidden justify-center lg:flex" aria-hidden>
            <div className="relative">
              <div
                className="absolute inset-6 rounded-full bg-gold-300/15 blur-3xl"
                aria-hidden
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artwork.src}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                decoding="async"
                className="relative w-52 max-w-full drop-shadow-2xl"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
