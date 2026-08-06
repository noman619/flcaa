export const SITE = {
  name: "Prolicense Florida",
  shortName: "Prolicense",
  legalName: "Prolicense Florida",
  tagline:
    "Providing Florida-approved license courses online to students nationwide.",
  // The real numbers, as published on flcaa.com/contact — these were
  // placeholders, and a placeholder phone number on a live contact page is
  // worse than none.
  phone: "866-411-8470",
  phoneHref: "tel:+18664118470",
  email: "info@flcaa.com",
  address: "919 NE 24th Ave, Hallandale Beach, FL 33009",
  hours: "Mon–Fri, 9am–6pm ET",
  // NOTE: marketing claims — these must be verifiable before launch.
  // Kept here so the hero, About page and auth panel never disagree.
  stats: [
    { value: "57,000+", label: "active learners" },
    { value: "87%+", label: "exam pass rate" },
    { value: "100%", label: "Florida DBPR approved" },
  ],
} as const;

/**
 * The Real Estate menu's own second level, matching the original: three
 * categories that open a further column, then two links that go straight
 * through.
 *
 * `links` on the track below is derived from this, so the footer, the mobile
 * drawer and the mega-menu cannot list different courses.
 */
export type NavLink = { label: string; href: string };

/** A menu entry that opens a further column, or one that just navigates. */
export type NavGroup = NavLink & { links?: readonly NavLink[] };

export const RE_NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "Licensing Courses",
    href: "/real-estate",
    links: [
      // The landing page, not the catalog entry — as on the original.
      {
        label: "63-Hour Sales Associate",
        href: "/florida-real-estate-license-course",
      },
      {
        label: "72-Hour Broker",
        href: "/florida-real-estate-broker-license-course",
      },
    ],
  },
  {
    label: "Post-Licensing Courses",
    href: "/real-estate",
    links: [
      {
        label: "45-Hour Sales Associate Post",
        href: "/florida-real-estate-45-hour-post-license-course",
      },
      { label: "60-Hour Broker Post", href: "/real-estate-broker-post-licensing" },
    ],
  },
  {
    label: "State Exam Prep",
    href: "/real-estate",
    links: [
      {
        label: "Sales Associate Exam Prep",
        href: "/florida-real-estate-practice-exam",
      },
      {
        label: "Mutual Recognition Exam Prep",
        href: "/courses/re-mutual-recognition-exam-prep",
      },
      { label: "Broker Exam Prep", href: "/real-estate-exam-prep" },
    ],
  },
  { label: "Continuing Education", href: "/fl-real-estate-continuing-education" },
  { label: "Course Extension", href: "/real-estate-courses-extension" },
];

/** Footer sitemap + mega-menu source of truth. Mirrors the IA in the brief. */
export const NAV_TRACKS = [
  {
    slug: "real-estate",
    title: "Real Estate",
    href: "/real-estate",
    description: "Sales associate & broker licensing, post-licensing, CE and exam prep.",
    groups: RE_NAV_GROUPS,
    links: RE_NAV_GROUPS.flatMap(
      (group) => group.links ?? [{ label: group.label, href: group.href }],
    ),
  },
  {
    slug: "cam",
    title: "CAM",
    href: "/cam",
    description: "Community Association Manager licensing, CE and state exam prep.",
    links: [
      { label: "CAM Licensing Course", href: "/florida-cam-license-course-online" },
      { label: "CAM Continuing Education", href: "/florida-cam-continuing-education" },
      { label: "State Exam Prep", href: "/florida-cam-exam-test-flashcards" },
      { label: "Course Extension", href: "/get-course-extension-retake" },
    ],
  },
  {
    slug: "board-members",
    title: "Board Members",
    href: "/board-members",
    description: "HOA and condo board certification and continuing education.",
    links: [
      { label: "Board Certification", href: "/board-certification-condo-hoa-fl" },
      {
        label: "Board Continuing Education",
        href: "/board-members-continuing-education",
      },
    ],
  },
] as const;

/**
 * Static guide pages — the SEO/marketing content of the original site.
 *
 * These carry no enrolment, pricing or progress, so they are deliberately NOT
 * rows in Supabase `courses`; they are constants driving real local routes
 * under src/app/. `path` mirrors the original slug exactly so the URLs survive
 * the migration, and `sourceUrl` records the page the copy still has to be
 * ported from.
 *
 * `courses` lists the slugs each guide should funnel to.
 */
export const RESOURCE_GUIDES = [
  {
    label: "How to Get Your Real Estate License",
    path: "/how-to-get-real-estate-license-in-florida",
    title: "How to Get Your Real Estate License in Florida",
    description:
      "The steps, hours and state exam required to become a licensed Florida real estate sales associate.",
    sourceUrl: "https://www.flcaa.com/how-to-get-real-estate-license-in-florida",
    courses: ["re-63-sales-associate", "re-sales-associate-exam-prep"],
  },
  {
    label: "How to Get Your CAM License",
    path: "/how-get-cam-license-florida",
    title: "How to Get Your CAM License in Florida",
    description:
      "What it takes to become a licensed Florida Community Association Manager, start to finish.",
    sourceUrl: "https://www.flcaa.com/how-get-cam-license-florida",
    courses: ["cam-licensing-course", "cam-exam-prep"],
  },
  {
    label: "Real Estate Exam Info",
    path: "/florida-real-estate-exam",
    title: "Florida Real Estate Exam Information",
    description:
      "Format, timing, scoring and scheduling for the Florida real estate state exam.",
    sourceUrl: "https://www.flcaa.com/florida-real-estate-exam",
    courses: ["re-sales-associate-exam-prep", "re-63-sales-associate"],
  },
  {
    label: "Real Estate License Cost",
    path: "/real-estate-license-florida-cost",
    title: "Florida Real Estate License Cost",
    description:
      "What a Florida real estate license actually costs — course, exam, fingerprinting and state fees.",
    sourceUrl: "https://www.flcaa.com/real-estate-license-florida-cost",
    courses: ["re-63-sales-associate", "re-45-sales-associate-post"],
  },
  {
    label: "CAM License Cost",
    path: "/florida-cam-license-cost",
    title: "Florida CAM License Cost",
    description:
      "A breakdown of the cost of getting and keeping a Florida CAM licence.",
    sourceUrl: "https://www.flcaa.com/florida-cam-license-cost",
    courses: ["cam-licensing-course", "cam-continuing-education"],
  },
  {
    label: "Real Estate Agent Income",
    path: "/florida-real-estate-agent-income-benefits",
    title: "Florida Real Estate Agent Income & Benefits",
    description:
      "What Florida real estate agents earn, how commission works, and the benefits of the career.",
    sourceUrl: "https://www.flcaa.com/florida-real-estate-agent-income-benefits",
    courses: ["re-63-sales-associate", "re-continuing-education"],
  },
] as const;

export type ResourceGuide = (typeof RESOURCE_GUIDES)[number];

/** Look a guide up by its path. Throws on a typo rather than rendering blank. */
export function getResourceGuide(path: string): ResourceGuide {
  const guide = RESOURCE_GUIDES.find((g) => g.path === path);
  if (!guide) throw new Error(`No RESOURCE_GUIDES entry for "${path}"`);
  return guide;
}

/** Resources mega-menu. Order and labels match the live site. */
export const NAV_RESOURCES = {
  title: "Resources",
  href: RESOURCE_GUIDES[0].path,
  description:
    "Guides, costs and exam information for every Florida licence we teach.",
  links: [
    ...RESOURCE_GUIDES.map(({ label, path }) => ({ label, href: path })),
    { label: "Blog", href: "/blog" },
    // The original has no About page — the link jumps to the homepage section.
    { label: "About", href: "/#about-us" },
    { label: "Leave a Review", href: "/reviews" },
  ],
} as const;

/* ---------------------------- footer navigation ---------------------------- */

/**
 * The label a track is known by in navigation and breadcrumbs.
 *
 * `tracks.name` in Supabase holds the fuller marketing name ("Board
 * Certification", "Real Estate School"), which is right for a page heading but
 * wrong for a breadcrumb — a visitor who clicked "Board Members" must see
 * "Board Members" in the trail. This keeps the two in step.
 */
export function trackLabel(slug: string | null | undefined, fallback = "Courses") {
  return NAV_TRACKS.find((t) => t.slug === slug)?.title ?? fallback;
}

export const FOOTER_POPULAR_COURSES = [
  // The landing page, not the catalog entry — as in the original's footer.
  {
    label: "Real Estate License Course",
    href: "/florida-real-estate-license-course",
  },
  { label: "CAM License Course", href: "/florida-cam-license-course-online" },
  {
    label: "Board Director Certification",
    href: "/board-certification-condo-hoa-fl",
  },
] as const;

export const FOOTER_RESOURCES = [
  // Same static guides as the Resources menu — see RESOURCE_GUIDES.
  { label: "How to Get My Real Estate License", href: RESOURCE_GUIDES[0].path },
  { label: "How to Get My CAM License", href: RESOURCE_GUIDES[1].path },
  { label: "Blog", href: "/blog" },
  { label: "About US", href: "/#about-us" },
] as const;

export const FOOTER_SUPPORT = [
  { label: "Contact Us", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Returns/Refunds", href: "/returns-refunds" },
] as const;

export const FOOTER_LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "SMS Terms", href: "/sms-terms" },
] as const;

/**
 * Social profiles, taken from the live flcaa.com footer. Only entries with a
 * url are rendered, so an unknown profile never ships as a dead link.
 */
export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100063749209834",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/channel/UCU3GOtyUPNPgbozYwjBoV8w",
  },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/prolicense-florida" },
  { label: "Instagram", url: "https://www.instagram.com/prolicenseflorida/" },
] as const;
