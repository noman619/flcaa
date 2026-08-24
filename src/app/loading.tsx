/**
 * Route-level loading skeleton.
 *
 * Shaped and *sized* like the pages it stands in for. Nearly every route opens
 * with a tinted hero — heading, intro, something in the right-hand column —
 * then bands of content below, so the block heights here mirror the real
 * sections: hero `py-16 lg:py-20` with a tall media/price panel beside it, and
 * content bands at `py-16 lg:py-24` like CourseHero, StatsBand and the topic
 * runs use. A skeleton that ends short pulls the footer up the screen and
 * drops it again the moment the page arrives.
 *
 * Deliberately neutral in colour: it stands in for dark heroes as well as
 * light ones, and a dark block flashing to a light page is worse than a grey
 * one settling into either.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      {/* hero band — matches CourseHero's padding and column split */}
      <div className="border-b border-ink-200/70 bg-mist-50">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <div className="h-11 w-11/12 max-w-lg animate-pulse rounded-lg bg-ink-100 lg:h-14" />
            <div className="mt-4 h-11 w-3/4 max-w-md animate-pulse rounded-lg bg-ink-100 lg:h-14" />

            <div className="mt-8 space-y-3">
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-5/6 max-w-lg animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-2/3 max-w-md animate-pulse rounded bg-ink-100" />
            </div>

            <div className="mt-10 h-12 w-48 animate-pulse rounded-full bg-ink-100" />
          </div>

          {/*
            The media column is a laptop mock-up, a video or a purchase card —
            all of them tall. 26rem is a purchase card with three included
            lines, which is the commonest of the three.
          */}
          <div className="h-80 animate-pulse rounded-hero bg-ink-100 lg:h-104" />
        </div>
      </div>

      {/* content band — the section paddings the real bands use */}
      <div className="border-b border-ink-200/70 bg-white">
        <div className="container-page py-16 lg:py-24">
          <div className="mx-auto h-9 w-2/3 max-w-md animate-pulse rounded-lg bg-ink-100 lg:h-11" />
          <div className="mx-auto mt-4 h-4 w-1/2 max-w-sm animate-pulse rounded bg-ink-100" />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-card border border-ink-200/60 bg-ink-50"
              />
            ))}
          </div>
        </div>
      </div>

      {/* a second band, so the page does not end a screen short */}
      <div className="bg-sand-100">
        <div className="container-page py-16 lg:py-24">
          <div className="h-8 w-1/3 max-w-xs animate-pulse rounded-lg bg-ink-200/60" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-card bg-ink-200/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
