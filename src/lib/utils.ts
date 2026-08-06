import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/**
 * Every date in the product is rendered in Florida time, deliberately.
 *
 * 1. Hydration: without an explicit zone, Intl uses the *runtime's* zone — UTC
 *    on the server, local in the browser — so any timestamp near a day boundary
 *    renders differently on each side and React reports a hydration mismatch.
 * 2. Correctness: access windows, CE deadlines and DBPR reporting are all
 *    Florida-local, so a student in California should still see the date the
 *    state will act on, not their own.
 */
export const TIME_ZONE = "America/New_York";

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

/**
 * Reading time for an article, in whole minutes.
 *
 * 265 words a minute — matched to the original site, whose own articles carry
 * the figure this produces ("3 min read" on the ~890-word school comparison).
 * Markdown syntax is stripped first so link URLs and heading marks do not
 * count as words. Never returns 0: "1 min read" is honest for a stub,
 * "0 min read" reads like a bug.
 */
export function readingMinutes(markdown: string | null | undefined): number {
  if (!markdown) return 1;
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 265));
}

/** Date + time, used in message threads. Same zone rule as above. */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

export function formatHours(hours: number | null | undefined): string | null {
  if (hours === null || hours === undefined || hours === 0) return null;
  const n = Number(hours);
  return `${Number.isInteger(n) ? n : n.toFixed(1)} hours`;
}

export function formatDuration(minutes: number | null | undefined): string {
  const m = minutes ?? 0;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

export function daysUntil(date: string | null | undefined): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function initials(name: string | null | undefined, fallback = "?"): string {
  if (!name) return fallback;
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
