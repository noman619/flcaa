"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/database.types";

/** Tabs, in the original's order. */
const TABS = [
  { key: "all", label: "All Posts" },
  { key: "real-estate", label: "Real Estate" },
  { key: "cam", label: "CAM" },
  { key: "board-members", label: "Board Members" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function PostCard({ post, priority }: { post: BlogPost; priority?: boolean }) {
  const category = (post as BlogPost & { category?: string }).category;
  const label = TABS.find((t) => t.key === category)?.label;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-panel border border-ink-200/70 bg-white shadow-card transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-ink-300/70 hover:shadow-card-hover">
      <div className="relative aspect-16/10 overflow-hidden bg-sand-100">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
        ) : null}

        {/* The tint only appears on hover, so the photograph is never muddied. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        {label ? (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-ink-800 uppercase backdrop-blur">
            {label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-[11px] tracking-[0.16em] text-ink-400 uppercase">
          {post.published_at ? formatShortDate(post.published_at) : "Draft"}
        </p>

        <h2 className="mt-3 font-display text-[1.15rem] leading-snug text-ink-950">
          <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink-600">
            {post.excerpt}
          </p>
        ) : null}

        <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-700 transition-colors duration-300 group-hover:text-brand-900">
          Read article
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </article>
  );
}

/**
 * Blog index with the original's category tabs.
 *
 * Filtering is client-side over an already-fetched list: twenty posts is far
 * less data than a round trip per tab, and switching feels instant.
 */
export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [tab, setTab] = React.useState<TabKey>("all");

  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: posts.length };
    for (const post of posts) {
      const key = (post as BlogPost & { category?: string }).category ?? "real-estate";
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [posts]);

  const shown =
    tab === "all"
      ? posts
      : posts.filter(
          (p) => ((p as BlogPost & { category?: string }).category ?? "real-estate") === tab,
        );

  return (
    <>
      {/* tabs */}
      <div className="border-b border-ink-200/70">
        <div className="container-page">
          <div
            role="tablist"
            aria-label="Filter posts by topic"
            className="-mb-px flex gap-8 overflow-x-auto"
          >
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`relative shrink-0 border-b-2 py-5 text-[13.5px] transition-colors duration-300 ${
                    active
                      ? "border-brand-700 text-ink-950"
                      : "border-transparent text-ink-500 hover:text-ink-900"
                  }`}
                >
                  {t.label}
                  <span className="ml-2 text-[11px] text-ink-400 tabular-nums">
                    {counts[t.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post, i) => (
            <PostCard key={post.id} post={post} priority={i < 3} />
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-500">
            No posts in this topic yet.
          </p>
        ) : null}
      </div>
    </>
  );
}
