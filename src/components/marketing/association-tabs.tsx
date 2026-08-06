"use client";

import * as React from "react";

export type AssociationTab = {
  /** Tab label — "Condo", "HOA", "Coop". */
  label: string;
  /** Panel body, rendered on the server and handed over as a slot. */
  panel: React.ReactNode;
};

/**
 * The "Select Your Type of Association" switcher.
 *
 * Tabs rather than three stacked blocks because the three offers differ only
 * in statute and price: a visitor belongs to exactly one association type and
 * reading the other two costs them time. The panels arrive as slots, so the
 * prices and Enroll buttons inside them stay server-rendered.
 *
 * Every panel is mounted and the inactive ones are hidden rather than dropped,
 * so all three are in the HTML for crawlers and in-page search.
 */
export function AssociationTabs({ tabs }: { tabs: readonly AssociationTab[] }) {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Type of association"
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.label}
              ref={(node) => {
                refs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`assoc-tab-${i}`}
              aria-selected={selected}
              aria-controls={`assoc-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`cursor-pointer rounded-t-panel px-4 py-4 font-display text-[1.05rem] transition-[background-color,color,transform] duration-300 ease-out-soft lg:text-[1.35rem] ${
                selected
                  ? "bg-brand-900 text-gold-300"
                  : "bg-brand-100 text-ink-800 hover:-translate-y-0.5 hover:bg-brand-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`assoc-panel-${i}`}
          aria-labelledby={`assoc-tab-${i}`}
          hidden={i !== active}
          className="rounded-b-panel rounded-tr-panel border border-ink-200/50 border-t-transparent bg-sand-100 p-6 shadow-card lg:p-10"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
