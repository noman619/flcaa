"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  MessageSquare,
  Receipt,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "My courses", href: "/dashboard", icon: BookOpen, exact: true },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Orders", href: "/dashboard/orders", icon: Receipt },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  // The course player has its own chrome — no sub-nav there.
  if (pathname.startsWith("/dashboard/courses/")) return null;

  return (
    <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur-xl">
      <nav
        className="container-page no-scrollbar flex gap-1 overflow-x-auto"
        aria-label="Dashboard sections"
      >
        {LINKS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-4 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 ease-out-soft",
                active
                  ? "border-brand-600 text-ink-900"
                  : "border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-800",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
