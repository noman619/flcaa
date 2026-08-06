import type { Metadata } from "next";
import Link from "next/link";
import {
  InstructorsBand,
  RelatedResources,
} from "@/components/course/course-sections";
import { RE_SCHOOL_INSTRUCTORS } from "@/lib/instructors";
import { CourseCatalog } from "@/components/marketing/course-catalog";
import { GoalCards } from "@/components/marketing/goal-cards";
import { SchoolHero } from "@/components/marketing/school-hero";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-real-estate-license-school-online            */
/* -------------------------------------------------------------------------- */

const HERO = {
  title: "Florida Real Estate License School Online",
  intro: "Florida's leading provider of real estate education.",
  /** The original's button lands on the 63-hour licensing course. */
  cta: {
    label: "Get Your Real Estate License",
    href: "/florida-real-estate-license-course",
  },
  art: { src: "/track/house-outline.svg", alt: "" },
} as const;

/**
 * Section 2, in the order the original lays the cards out on screen.
 *
 * One target differs from the original's hrefs: it sends "Get My Broker
 * Post-Licensing" off-site to RECampus, so that card points at our own catalog
 * entry instead and the visitor stays in one cart.
 */
const GOALS = [
  {
    title: "Get My Real Estate License",
    blurb:
      "Become a real estate agent by completing your sales associate pre-license course.",
    href: "/florida-real-estate-license-course",
    image: "/track/goal-license.jpg",
    alt: "A man holding his real estate diploma at his laptop",
  },
  {
    title: "Pass the State Exam",
    blurb:
      "Get the most innovative program to pass your Florida real estate exam the first time.",
    href: "/florida-real-estate-practice-exam",
    image: "/track/goal-exam.jpg",
    alt: "A woman holding up two passed exam papers",
  },
  {
    title: "Get My Post-Licensing Hours",
    blurb:
      "Complete the 45-hour sales associate post-licensing requirement.",
    href: "/florida-real-estate-45-hour-post-license-course",
    image: "/track/goal-post.jpg",
    alt: "A man studying online from the floor of his living room",
  },
  {
    title: "Get My Real Estate CE Credits",
    blurb: "Complete 14 hours of Florida real estate continuing education.",
    href: "/fl-real-estate-continuing-education",
    image: "/track/goal-ce.jpg",
    alt: "A woman with a coffee and a laptop on her sofa",
  },
  {
    title: "Become a Real Estate Broker",
    blurb: "Level-up your career to a real estate licensed broker.",
    href: "/florida-real-estate-broker-license-course",
    image: "/track/goal-broker.jpg",
    alt: "A couple signing a real estate application",
  },
  {
    title: "Get My Broker Post-Licensing",
    blurb: "Complete your broker 60-hour post-licensing education.",
    href: "/real-estate-broker-post-licensing",
    image: "/track/goal-broker-post.jpg",
    alt: "A real estate agent with a young couple",
  },
] as const;

/** Section 3 — the positioning line, on the original's navy field. */
const PITCH = {
  title: "Online Real Estate School When and Where You Want It",
  /** The original links this phrase to its own review of Florida schools. */
  link: {
    label: "Florida's leading online real estate school",
    href: "/blog/best-online-florida-real-estate-school",
  },
} as const;

/**
 * Section 4. This page's own trio — not RELATED_RESOURCES, which closes on the
 * agent/broker post. Two of these are guides, one is a blog post, matching the
 * original's targets exactly.
 */
const RESOURCES = [
  {
    title: "Real Estate License Cost",
    image: "/track/res-cost.jpg",
    href: "/real-estate-license-florida-cost",
  },
  {
    title: "Florida Real Estate Exam",
    image: "/track/res-exam.jpg",
    href: "/florida-real-estate-exam",
  },
  {
    title: "Get Your License in 5 Weeks",
    image: "/track/res-5weeks.jpg",
    href: "/blog/florida-real-estate-license-fast",
  },
] as const;

/**
 * Section 6 — the catalog, in the original's groups and order.
 *
 * Two targets differ from the original's: broker post-licensing goes off-site
 * to RECampus there, and its three CE entries all point at one CE page, so
 * each lands on our own catalog entry instead.
 */
const CATALOG = [
  {
    label: "Pre-Licensing Courses",
    courses: [
      {
        title: "Real Estate Sales Associate Pre-Licensing",
        length: "Course Length: 63 Hours",
        blurb:
          "To start your journey toward a successful career as a real estate agent in Florida, the first step is to enroll in a Sales Associate pre-licensing course.",
        href: "/florida-real-estate-license-course",
        image: "/track/catalog/sa-pre.jpg",
        alt: "A Florida real estate agent",
      },
      {
        title: "Real Estate Broker Pre-Licensing",
        length: "Course Length: 72 Hours",
        blurb:
          "After gaining two years of experience as a Sales Associate in Florida, you can elevate your career to new heights by becoming a real estate Broker.",
        href: "/florida-real-estate-broker-license-course",
        image: "/track/catalog/broker-pre.jpg",
        alt: "A couple and a real estate agent talking at home",
      },
    ],
  },
  {
    label: "State Exam Preparation",
    courses: [
      {
        title: "Florida Real Estate Practice Exams",
        blurb:
          "Enhance your chances of passing the Florida sales associate state exam with our comprehensive real estate practice exams and flashcards.",
        href: "/florida-real-estate-practice-exam",
        image: "/track/catalog/practice-exams.jpg",
        alt: "A student studying at a laptop",
      },
    ],
  },
  {
    label: "Post-Licensing Courses",
    courses: [
      {
        title: "Real Estate Sales Associate Post-Licensing",
        length: "Course Length: 45 Hours",
        blurb:
          "Florida real estate Sales Associates are required to complete 45 hours of Post-Licensing education before their first license renewal deadline.",
        href: "/florida-real-estate-45-hour-post-license-course",
        image: "/track/catalog/sa-post.jpg",
        alt: "A woman taking an online real estate course",
      },
      {
        title: "Real Estate Broker Post-Licensing",
        length: "Course Length: 60 Hours",
        blurb:
          "Florida real estate Brokers are required to complete 60 hours of Post-Licensing education before their first license renewal deadline.",
        href: "/real-estate-broker-post-licensing",
        image: "/track/catalog/broker-post.jpg",
        alt: "A real estate business representative",
      },
    ],
  },
  {
    label: "Continuing Education Courses",
    courses: [
      {
        title: "Continuing Education for Florida Real Estate Professionals",
        length: "Course Length: 14 Hours",
        blurb:
          "Meet your entire 14-hour Florida continuing education requirement with this course, which includes the necessary specialty, core law, and ethics training.",
        href: "/fl-real-estate-continuing-education",
        image: "/track/catalog/ce-14.jpg",
        alt: "A continuing education notebook",
      },
      {
        title: "Ethics for Florida Real Estate Professionals",
        length: "Course Length: 3 Hours",
        blurb:
          "This course highlights the significance of ethics, morality, and fairness in the real estate industry, focusing on the National Association of REALTORS® Code of Ethics as a comprehensive guide for proper conduct among real estate practitioners.",
        href: "/fl-real-estate-continuing-education",
        image: "/track/catalog/ce-ethics.jpg",
        alt: "Letter blocks spelling the word ethics",
      },
      {
        title: "Florida Real Estate Core Law",
        length: "Course Length: 3 Hours",
        blurb:
          "Fulfill your Florida core law continuing education requirement with this comprehensive course. Designed specifically for real estate professionals, the course provides an in-depth understanding of Florida's real estate laws, regulations, and best practices.",
        href: "/fl-real-estate-continuing-education",
        image: "/track/catalog/ce-core-law.jpg",
        alt: "A hand holding an ethics symbol",
      },
    ],
  },
] as const;

export const metadata: Metadata = {
  title: "Florida Real Estate School — Licensing, Post-License & CE",
  description:
    "Florida-approved 63-hour sales associate and 72-hour broker licensing courses, post-licensing, continuing education and state exam prep. Self-paced and online.",
  alternates: { canonical: "/real-estate" },
  openGraph: {
    title: "Florida Real Estate School",
    description:
      "63-hour sales associate, 72-hour broker, post-licensing, CE and exam prep — all state approved.",
    url: "/real-estate",
  },
};

export default function RealEstatePage() {
  return (
    <>
      <SchoolHero
        title={HERO.title}
        intro={HERO.intro}
        cta={HERO.cta}
        art={HERO.art}
        breadcrumb="Real Estate"
      />

      <GoalCards title="Select Your Goal" goals={GOALS} />

      {/* ------------------------------- pitch -------------------------------
          One sentence on a dark field. Nothing else in the band: it is a
          statement of position, and anything beside it would turn it into a
          caption. */}
      <section className="relative overflow-hidden border-b border-ink-200/70 bg-brand-950">
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 size-160 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-800/40 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page py-16 text-center lg:py-24">
          <h2 className="reveal mx-auto max-w-3xl font-display text-[1.7rem] leading-tight font-light text-white lg:text-[2.3rem]">
            {PITCH.title}
          </h2>

          <span
            className="mx-auto mt-7 block h-px w-12 bg-white/30"
            aria-hidden
          />

          <p className="reveal mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-gold-100/90">
            Prolicense is{" "}
            <Link
              href={PITCH.link.href}
              className="text-white underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white"
            >
              {PITCH.link.label}
            </Link>{" "}
            providing licensing, exam prep, and continuing education courses.
          </p>
        </div>
      </section>

      <RelatedResources items={RESOURCES} />

      <InstructorsBand
        title="Meet Your Real Estate Instructors"
        instructors={RE_SCHOOL_INSTRUCTORS}
      />

      <CourseCatalog title="Course Catalog" groups={CATALOG} />
    </>
  );
}
