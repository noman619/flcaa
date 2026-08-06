import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Pill geometry throughout, one easing curve, and a two-part hover: a 1px
 * lift plus a deeper shadow. Accent (coral) is reserved for the single most
 * important action in a view; brand (teal) carries identity everywhere else.
 */
/**
 * One button system. Nothing is heavier than medium, every variant shares the
 * same geometry and easing, and elevation is a whisper rather than a drop —
 * a button should read as a considered surface, not a shouted call.
 */
const buttonVariants = cva(
  [
    // One radius for every button on the site.
    "group/btn relative inline-flex items-center justify-center gap-2 rounded-full",
    "font-medium tracking-[0.01em] whitespace-nowrap select-none",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-250 ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    "active:translate-y-0 active:duration-75",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-brand-800 text-white",
          "hover:-translate-y-px hover:bg-brand-900 hover:shadow-brand",
        ],
        accent: [
          "bg-accent-600 text-white",
          "hover:-translate-y-px hover:bg-accent-700 hover:shadow-accent",
        ],
        dark: [
          "bg-ink-900 text-white",
          "hover:-translate-y-px hover:bg-ink-950 hover:shadow-card",
        ],
        /* Green. Scoped to the article CTAs, which the original sets in it. */
        leaf: [
          "bg-leaf-500 text-white",
          "hover:-translate-y-px hover:bg-leaf-600 hover:shadow-card",
        ],
        outline: [
          "border border-ink-200 bg-transparent text-ink-800",
          "hover:-translate-y-px hover:border-ink-300 hover:bg-white hover:shadow-xs",
        ],
        ghost: "text-ink-500 hover:bg-ink-100/70 hover:text-ink-900",
        subtle: "bg-ink-100 text-ink-800 hover:-translate-y-px hover:bg-ink-200",
        danger: [
          "bg-accent-700 text-white",
          "hover:-translate-y-px hover:bg-accent-800",
        ],
        link: "h-auto rounded-none p-0 text-brand-700 underline-offset-4 hover:text-brand-900 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[12.5px]",
        md: "h-11 px-5 text-[13.5px]",
        lg: "h-12 px-7 text-sm",
        icon: "size-10",
      },
      /**
       * Lettering only — never geometry. Radius is fixed on the base so no
       * variant can introduce a second button shape.
       */
      tracked: {
        true: "text-[11px] tracking-[0.18em] uppercase",
        false: "",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      tracked: false,
      block: false,
    },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string };

export type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className,
  variant,
  size,
  tracked,
  block,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, tracked, block }), className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = BaseProps &
  React.ComponentPropsWithoutRef<typeof Link>;

export function ButtonLink({
  className,
  variant,
  size,
  tracked,
  block,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, tracked, block }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
