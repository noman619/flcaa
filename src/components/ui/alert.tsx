import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const styles = {
  info: {
    wrap: "bg-brand-50/70 text-brand-900 ring-brand-200/70",
    icon: "text-brand-600",
    Icon: Info,
  },
  success: {
    wrap: "bg-emerald-50/70 text-emerald-900 ring-emerald-200/70",
    icon: "text-emerald-600",
    Icon: CheckCircle2,
  },
  warning: {
    wrap: "bg-amber-50/70 text-amber-900 ring-amber-200/70",
    icon: "text-amber-600",
    Icon: TriangleAlert,
  },
  error: {
    wrap: "bg-red-50/70 text-red-900 ring-red-200/70",
    icon: "text-red-600",
    Icon: AlertCircle,
  },
} as const;

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: keyof typeof styles;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { wrap, icon, Icon } = styles[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "animate-fade-in flex gap-3.5 rounded-2xl p-4 text-sm leading-relaxed ring-1 ring-inset",
        wrap,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", icon)} aria-hidden />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-medium tracking-tight">{title}</p> : null}
        {children ? <div className={cn(title && "mt-1 opacity-90")}>{children}</div> : null}
      </div>
    </div>
  );
}
