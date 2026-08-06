import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-20 lg:py-28", className)} {...props}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "reveal mb-12 flex flex-col gap-5 lg:mb-16",
        align === "center"
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="eyebrow mb-3 flex items-center gap-2.5">
            {align === "left" ? (
              <span
                className="h-px w-6 bg-brand-400"
                aria-hidden
              />
            ) : null}
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-[2rem] lg:text-[2.75rem]">{title}</h2>
        {description ? (
          <p className="mt-4 text-[17px] leading-relaxed text-ink-500">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
