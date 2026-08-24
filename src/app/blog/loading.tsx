/**
 * The blog index is a list of article cards: a 16/10 cover with a two-line
 * title under it. Heights follow the real cards so the footer sits where it
 * will still be once the posts load.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading articles…</span>

      <div className="border-b border-ink-200/70 bg-sand-100">
        <div className="container-page py-12 lg:py-16">
          <div className="h-4 w-32 animate-pulse rounded bg-ink-200/60" />
          <div className="mt-6 h-10 w-56 animate-pulse rounded-lg bg-ink-200/60 lg:h-12" />
          <div className="mt-4 h-4 w-2/3 max-w-lg animate-pulse rounded bg-ink-200/60" />
        </div>
      </div>

      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-16/10 w-full animate-pulse rounded-card bg-ink-100" />
              <div className="mt-4 h-5 w-5/6 animate-pulse rounded bg-ink-100" />
              <div className="mt-2 h-5 w-2/3 animate-pulse rounded bg-ink-100" />
              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-ink-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
