export default function Loading() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-lg bg-ink-100" />
      <div className="mt-4 h-5 w-1/2 max-w-sm animate-pulse rounded bg-ink-100" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-card border border-ink-200 bg-ink-50"
          />
        ))}
      </div>
    </div>
  );
}
