/**
 * Per-article media and calls to action.
 *
 * The article bodies are Markdown in Supabase, so anything that is not prose —
 * an embedded video, a closing button — cannot live inside them without
 * shipping raw HTML through the renderer. Keyed by slug here instead, and
 * rendered by the post page around the body.
 */
export type PostExtras = {
  /** Video the original embeds in the article. */
  video?: { id: string; title: string; poster: string };
  /** Closing call to action, under the body. */
  cta?: { label: string; href: string };
};

export const POST_EXTRAS: Record<string, PostExtras | undefined> = {
  "best-online-florida-real-estate-school": {
    video: {
      id: "_j8uHb6noZM",
      title: "How to Select the Best Real Estate School in Florida",
      poster: "/blog/best-school-video-poster.jpg",
    },
    cta: {
      label: "Get Your Florida Real Estate License Today",
      href: "/florida-real-estate-license-course",
    },
  },
};
