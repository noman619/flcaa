"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Link2 } from "lucide-react";
import { SITE_URL } from "@/lib/env";

/** Brand marks, inline — lucide dropped its brand icon set. */
const MARKS = {
  facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.93 8.44-9.94Z",
  x: "M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.62-6.04L5.94 21H2.92l7.06-8.07L2.5 3h6.05l4.18 5.52L17.53 3Zm-1.06 16.2h1.67L7.6 4.72H5.8L16.47 19.2Z",
  linkedin:
    "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.5 8.75h3.5V21H3.5V8.75Zm5.75 0h3.36v1.67h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.2 4.18 5.07V21h-3.5v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.19 1.45-2.19 2.96V21h-3.3V8.75Z",
} as const;

function Mark({ path, label }: { path: string; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden focusable="false">
      <title>{label}</title>
      <path d={path} />
    </svg>
  );
}

const linkClass =
  "flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900";

/**
 * The end of an article: its category, then share actions — matching the
 * original post layout.
 *
 * A client component only because copying to the clipboard needs the browser;
 * the share links themselves are plain anchors and work without JavaScript.
 */
export function PostFooter({
  slug,
  title,
  category,
  categoryLabel,
}: {
  slug: string;
  title: string;
  category?: string;
  categoryLabel?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const url = `${SITE_URL}/blog/${slug}`;

  return (
    <footer className="mt-14 border-t border-ink-200/70 pt-6">
      {category && categoryLabel ? (
        <p>
          <Link
            href={`/blog?topic=${category}`}
            className="text-sm text-ink-700 underline underline-offset-4 transition-colors hover:text-ink-950"
          >
            {categoryLabel}
          </Link>
        </p>
      ) : null}

      <div className="mt-6 flex items-center gap-1 border-t border-ink-200/70 pt-5">
        <a
          className={linkClass}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Share on Facebook"
        >
          <Mark path={MARKS.facebook} label="Facebook" />
        </a>
        <a
          className={linkClass}
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Share on X"
        >
          <Mark path={MARKS.x} label="X" />
        </a>
        <a
          className={linkClass}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Mark path={MARKS.linkedin} label="LinkedIn" />
        </a>

        <button
          type="button"
          className={linkClass}
          aria-label={copied ? "Link copied" : "Copy link"}
          onClick={() => {
            void navigator.clipboard.writeText(url).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
        >
          {copied ? (
            <Check className="size-4 text-leaf-600" aria-hidden />
          ) : (
            <Link2 className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </footer>
  );
}
