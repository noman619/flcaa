import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-ink-200/70",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-brand-600 transition-[width] duration-700 ease-out-soft",
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
