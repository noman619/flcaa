import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-panel border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center",
        className,
      )}
    >

      <div className="icon-tile icon-tile-lg relative mb-5 size-14 bg-white shadow-card">
        <Icon className="size-6" aria-hidden />
      </div>
      <p className="relative font-display text-xl text-ink-900">
        {title}
      </p>
      {description ? (
        <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="relative mt-6">{action}</div> : null}
    </div>
  );
}
