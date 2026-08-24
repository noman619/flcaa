import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Fields sit slightly recessed against the page, then lift on focus with a
 * soft brand halo rather than a hard outline.
 */
const fieldStyles = [
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900",
  "shadow-xs transition-[border-color,box-shadow,background-color] duration-200 ease-out-soft",
  "placeholder:text-ink-400",
  "hover:border-ink-300",
  "focus:border-brand-400 focus:ring-4 focus:ring-brand-500/12 focus:outline-none",
  "disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400",
  "aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-red-500/10",
].join(" ");

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldStyles, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(fieldStyles, "min-h-28 resize-y", className)} {...props} />
  );
}

export function Select({
  className,
  ref,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  /** So a caller can reset the field — React 19 passes refs as a prop. */
  ref?: React.Ref<HTMLSelectElement>;
}) {
  return (
    <select
      ref={ref}
      className={cn(fieldStyles, "h-11 appearance-none bg-no-repeat pr-10", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236c8288' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.85rem center",
      }}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-2 block text-[13px] font-medium tracking-tight text-ink-800",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-0.5 text-accent-500">*</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <p className="mt-2 text-xs leading-relaxed text-ink-500">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
