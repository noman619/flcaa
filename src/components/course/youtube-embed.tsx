"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Click-to-play YouTube facade.
 *
 * The poster is served from our own domain and the iframe is only mounted once
 * a visitor asks for it, so the page costs nothing to YouTube until then — an
 * embedded player pulls ~1MB of script and sets cookies on load, which is a
 * heavy price for a video most visitors never start.
 */
export function YouTubeEmbed({
  id,
  title,
  poster,
}: {
  id: string;
  title: string;
  poster: string;
}) {
  const [playing, setPlaying] = React.useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-panel bg-black shadow-pop ring-1 ring-white/15">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
          />
          <span
            className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
            aria-hidden
          />
          <span
            className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-600 text-white shadow-pop transition-transform duration-300 ease-out-soft group-hover:scale-110 lg:size-20"
            aria-hidden
          >
            <Play className="size-6 translate-x-0.5 fill-current lg:size-7" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5 text-left text-[13px] leading-snug font-medium text-white/90 lg:p-6 lg:text-sm">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
