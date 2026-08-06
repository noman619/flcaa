"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  LogOut,
  MessageSquare,
  Receipt,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "My courses", href: "/dashboard", icon: Award },
  { label: "Order history", href: "/dashboard/orders", icon: Receipt },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Account settings", href: "/dashboard/settings", icon: Settings },
];

export function UserMenu({
  name,
  email,
  initials,
  isAdmin,
}: {
  name: string;
  email: string | null;
  initials: string;
  isAdmin: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={cn(
          "icon-tile size-9 bg-brand-700 text-xs font-medium text-white transition-transform duration-300 ease-out-soft hover:scale-105",
          open && "ring-2 ring-brand-500 ring-offset-2 ring-offset-sand-50",
        )}
      >
        {initials}
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-fade-up absolute top-full right-0 z-50 mt-2.5 w-64 overflow-hidden rounded-panel border border-ink-200/70 bg-white shadow-pop"
        >
          <div className="border-b border-ink-200/70 bg-ink-50/50 px-4 py-3.5">
            <p className="truncate text-sm font-medium text-ink-900">{name}</p>
            {email ? (
              <p className="mt-0.5 truncate text-xs text-ink-500">{email}</p>
            ) : null}
          </div>
          <ul className="p-2">
            {ITEMS.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-ink-600 transition-colors duration-200 hover:bg-ink-50 hover:text-ink-900"
                >
                  <Icon className="size-4 text-ink-400" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  role="menuitem"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-brand-700 transition-colors duration-200 hover:bg-brand-50"
                >
                  <Shield className="size-4" aria-hidden />
                  Admin dashboard
                </Link>
              </li>
            ) : null}
          </ul>
          <form
            action="/auth/signout"
            method="post"
            className="border-t border-ink-200/70 p-2"
          >
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-ink-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4 text-ink-400" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
