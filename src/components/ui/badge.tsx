import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ring-1 ring-inset [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        neutral: "bg-ink-100 text-ink-700 ring-ink-200/70",
        brand: "bg-brand-50 text-brand-800 ring-brand-200/70",
        accent: "bg-accent-50 text-accent-700 ring-accent-200/70",
        success: "bg-emerald-50 text-emerald-800 ring-emerald-200/70",
        warning: "bg-amber-50 text-amber-800 ring-amber-200/70",
        danger: "bg-red-50 text-red-700 ring-red-200/70",
        outline: "bg-white/80 text-ink-600 ring-ink-200",
        solid: "bg-ink-900 text-white ring-transparent",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px] tracking-wide",
        md: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
