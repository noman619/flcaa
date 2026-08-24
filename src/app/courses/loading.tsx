/**
 * The catalog really is a card grid, so it keeps one — sized to the real
 * CourseCard: a 16/10 cover, then title, subtitle and a meta row, which lands
 * around 22rem. The header band and filter row above it are matched too, so
 * the grid does not jump up the page when the courses arrive.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading courses…</span>

      {/* PageHero */}
      <div className="border-b border-ink-200/70 bg-mist-50">
        <div className="container-page py-12 lg:py-16">
          <div className="h-4 w-40 animate-pulse rounded bg-ink-100" />
          <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-ink-100 lg:h-12" />
          <div className="mt-4 h-4 w-1/2 max-w-lg animate-pulse rounded bg-ink-100" />
        </div>
      </div>

      <div className="container-page py-12 lg:py-16">
        {/* two filter rows */}
        <div className="mb-10 space-y-4">
          {Array.from({ length: 2 }).map((_, row) => (
            <div key={row} className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-28 animate-pulse rounded-full bg-ink-100"
                />
              ))}
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-88 animate-pulse rounded-card border border-ink-200/60 bg-ink-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
