import * as React from "react";

export type Expense = {
  title: string;
  /** The figure as the original words it — "$250 per Year", "$100 Every Two Years". */
  cost: string;
  body: readonly React.ReactNode[];
};

/**
 * Ongoing costs of holding a licence: a lead-in, then one card per expense.
 *
 * A two-column grid rather than the original's single stacked run. These items
 * are independent — nothing about insurance follows from marketing — so the
 * vertical list only makes the reader scroll past six blocks to compare two
 * figures. The amount is pulled out of the prose into a pill so the numbers
 * can be scanned down the page without reading a word.
 */
export function ExpenseList({
  title,
  lead,
  note,
  items,
}: {
  title: string;
  /** Paragraphs under the heading. */
  lead: readonly React.ReactNode[];
  /** The line introducing the list itself. Omitted when there is no list. */
  note?: string;
  /** The CAM guide runs this section as prose alone, with no cards. */
  items?: readonly Expense[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <div className="reveal mx-auto max-w-3xl">
          <h2 className="font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
            {title}
          </h2>

          <div className="mt-6 space-y-4">
            {lead.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-ink-600">
                {paragraph}
              </p>
            ))}
          </div>

          {note ? (
            <p className="mt-6 text-[15px] leading-relaxed font-medium text-ink-900">
              {note}
            </p>
          ) : null}
        </div>

        {items?.length ? (
        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 lg:mt-14 lg:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.title}
              className="reveal flex flex-col rounded-panel border border-ink-200/70 bg-sand-50 p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:p-8"
            >
              <h3 className="font-display text-lg text-ink-950 lg:text-xl">
                {item.title}
              </h3>

              <p className="mt-4">
                <span className="inline-flex items-center rounded-full bg-brand-950 px-4 py-1.5 text-[13px] font-medium text-white tabular-nums">
                  {item.cost}
                </span>
              </p>

              <div className="mt-5 space-y-3">
                {item.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[14.5px] leading-relaxed text-ink-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
        ) : null}
      </div>
    </section>
  );
}
