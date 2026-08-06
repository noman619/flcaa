import { RESOURCE_GUIDES } from "@/lib/site";

/**
 * Per-course marketing extras for the catalog detail page.
 *
 * A map rather than database columns: these are assets and copy that ship with
 * the app, and adding them to another course should not need a migration.
 */

/** Optional course overview video. */
export const COURSE_VIDEOS: Record<string, string | undefined> = {
  "re-mutual-recognition-exam-prep": "/course/mutual-recognition-overview.mp4",
};

/**
 * Headline claims for the hero.
 *
 * When a course has these, its detail page leads with the full description and
 * these bullets — matching its marketing landing page — instead of the short
 * subtitle. The description is then not repeated in the overview section below.
 */
export const COURSE_HIGHLIGHTS: Record<string, readonly string[] | undefined> = {
  "re-mutual-recognition-exam-prep": [
    "Take the course online—on any device, anytime",
    "Use our intuitive exam prep system",
    "Practice on the go with our flashcards",
  ],
};

/**
 * Feature list for the pricing section, in the original's order.
 *
 * Prices are NOT stored here — they are read from the course row and the
 * promotion, so the panel can never advertise a figure the checkout will not
 * honour. Only the wording of what is included lives in code.
 */
export const COURSE_FEATURES: Record<string, readonly string[] | undefined> = {
  "re-mutual-recognition-exam-prep": [
    "State-Approved School",
    "Fully Narrated Online Program",
    "Dedicated Instructor Support 24/7",
    "30-Day Money-Back Guarantee",
    "4-Month Access",
    "State Exam Simulator",
    "Digital Flashcards",
  ],
};

/**
 * "What to Expect" figures for the stats band.
 *
 * Marketing claims, so they live in code next to the page that shows them
 * rather than in the catalog row — and only courses listed here get the band.
 */
export const COURSE_STATS: Record<
  string,
  readonly { value: string; label: string }[] | undefined
> = {
  "re-mutual-recognition-exam-prep": [
    { value: "92%", label: "Pass rate" },
    { value: "24/7", label: "Instructor support" },
    { value: "5/5", label: "Satisfaction rate" },
  ],
};

/**
 * "Ace The Florida Real Estate Exam" comparison chart.
 *
 * `blurbLink` points at whichever course the claim is evidenced by, so the
 * footnote is a real link rather than decoration.
 */
export const COURSE_EXAM_CHART: Record<
  string,
  | {
      title: string;
      blurbLead: string;
      blurbLink: { label: string; href: string };
      bars: readonly { label: string; value: number; tone: string }[];
    }
  | undefined
> = {
  "re-mutual-recognition-exam-prep": {
    title: "Ace The Florida Real Estate Exam",
    blurbLead:
      "Average scores are based on the aggregated results of over 1,500 real estate students who completed our proprietary ",
    blurbLink: {
      label: "exam-prep assessment",
      href: "/florida-real-estate-practice-exam",
    },
    bars: [
      { label: "Prolicense Florida", value: 92, tone: "bg-gradient-to-t from-brand-500 to-brand-200" },
      { label: "State Average", value: 52, tone: "bg-gradient-to-t from-gold-600 to-gold-200" },
    ],
  },
};

/**
 * "Related Resources" cards. One definition — the same three appear on every
 * course and landing page, and were previously duplicated per page.
 */
export const RELATED_RESOURCES = [
  {
    title: "Get Your Florida Real Estate License in Less Than 5 Weeks",
    image: "/course/res-license-fast.jpg",
    href: "/blog/florida-real-estate-license-fast",
  },
  {
    title: "Difference Between a Real Estate Agent and a Broker",
    image: "/course/res-agent-broker.jpg",
    href: "/blog/what-is-the-difference-between-a-real-estate-agent-and-broker",
  },
  {
    title: "Florida Real Estate License Exam",
    image: "/course/res-exam.png",
    href: RESOURCE_GUIDES[2].path, // /florida-real-estate-exam — a guide, not a post
  },
] as const;

/**
 * The trio shown on /how-to-get-real-estate-license-in-florida. It shares the
 * first two cards with RELATED_RESOURCES but closes on the school comparison
 * rather than the exam guide, so it is its own set.
 */
export const HOW_TO_LICENSE_RESOURCES = [
  RELATED_RESOURCES[0],
  RELATED_RESOURCES[1],
  {
    title: "The Best Online Florida Real Estate School for You",
    image: "/course/res-online-school.jpg",
    href: "/blog/best-online-florida-real-estate-school",
  },
] as const;

/**
 * The CAM trio, shown on both /how-get-cam-license-florida (as "Recent Posts")
 * and /florida-cam-license-course-online.
 */
export const CAM_RESOURCES = [
  {
    title: "Salaries and Benefits of Licensed CAM in Florida",
    image:
      "/blog/salary-income-money-licensed-cam-community-association-manager-florida.jpg",
    href: "/blog/salary-income-money-licensed-cam-community-association-manager-florida",
  },
  {
    title: "Is the Florida CAM Test Hard?",
    image: "/blog/is-the-florida-cam-test-hard.jpg",
    href: "/blog/is-the-florida-cam-test-hard",
  },
  {
    title: "How to Pass the Florida CAM License Exam the First Time?",
    image: "/blog/how-to-pass-florida-cam-license-exam-the-first-time.jpg",
    href: "/blog/how-to-pass-florida-cam-license-exam-the-first-time",
  },
] as const;

/**
 * The board trio, shown as "Recent Posts" on both board pages —
 * /board-certification-condo-hoa-fl and /board-members-continuing-education.
 *
 * Named rather than "the latest three": the rail is about board service, and
 * the newest posts on the blog are usually real-estate ones.
 */
export const BOARD_POST_SLUGS = [
  "condo-board-members-conflicts-of-interests-service-providers-in-florida",
  "legislation-impacting-florida-homeowners-associations",
  "2024-legislation-impacting-florida-condominium-associations",
] as const;
