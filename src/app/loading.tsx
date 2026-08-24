/**
 * Route-level loading skeleton.
 *
 * Shaped like the pages it stands in for: nearly every route on this site
 * opens with a tinted hero — heading, a line or two of intro, something in the
 * right-hand column — and then a band of content below. The previous skeleton
 * drew a six-card grid, which only ever matched /courses, so every other page
 * visibly rearranged itself the moment it loaded.
 *
 * Deliberately neutral in colour: it stands in for dark heroes as well as
 * light ones, and a dark block flashing to a light page is worse than a grey
 * one settling into either.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* hero band */}
      <div className="border-b border-ink-200/70 bg-mist-50">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <div className="h-11 w-11/12 max-w-lg animate-pulse rounded-lg bg-ink-100" />
            <div className="mt-4 h-11 w-3/4 max-w-md animate-pulse rounded-lg bg-ink-100" />

            <div className="mt-8 space-y-3">
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-5/6 max-w-lg animate-pulse rounded bg-ink-100" />
            </div>

            <div className="mt-10 h-12 w-48 animate-pulse rounded-full bg-ink-100" />
          </div>

          {/* media or price card */}
          <div className="h-64 animate-pulse rounded-hero bg-ink-100 lg:h-80" />
        </div>
      </div>

      {/* first content band */}
      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto h-8 w-2/3 max-w-md animate-pulse rounded-lg bg-ink-100" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-card border border-ink-200/60 bg-ink-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
