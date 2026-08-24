/**
 * The catalog is the one route that really is a card grid, so it keeps the
 * grid skeleton the root route used to draw for everything.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading courses…</span>

      <div className="border-b border-ink-200/70 bg-mist-50">
        <div className="container-page py-12 lg:py-16">
          <div className="h-4 w-40 animate-pulse rounded bg-ink-100" />
          <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-ink-100" />
          <div className="mt-4 h-4 w-1/2 max-w-sm animate-pulse rounded bg-ink-100" />
        </div>
      </div>

      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-card border border-ink-200/60 bg-ink-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
