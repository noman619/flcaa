"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Newspaper,
  Receipt,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Questions", href: "/admin/questions", icon: ListChecks },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Inbox", href: "/admin/messages", icon: Inbox },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-ink-200/70 bg-white/80 backdrop-blur-xl">
      <nav
        className="container-page no-scrollbar flex gap-1 overflow-x-auto"
        aria-label="Admin sections"
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
