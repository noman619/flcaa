/**
 * The original site's URLs, mapped to their equivalent on this site.
 *
 * Two uses:
 *  - next.config.ts turns each into a redirect, so an old URL still resolves
 *    (inbound links, bookmarks, search results).
 *  - the blog import rewrites article links to the target, so the articles
 *    link straight to our pages rather than bouncing through a redirect.
 *
 * Anything already built at its original path (e.g. the licence course and the
 * resource guides) is deliberately absent — those need no mapping.
 */
export const LEGACY_ROUTES: Record<string, string> = {
  "/florida-real-estate-license-school-online": "/real-estate",
  "/florida-cam-license-school-online": "/cam",
  // No standalone About page — the original keeps About Us on the homepage.
  "/about": "/#about-us",
};
