import type { Metadata } from "next";
import { CostSummary } from "@/components/marketing/cost-summary";
import {
  CAM_COST_INTRO,
  CAM_COST_ROWS,
  COST_ARTWORK,
} from "@/content/license-costs";
import { RelatedResources } from "@/components/course/course-sections";
import { CAM_RESOURCES } from "@/lib/course-media";
import { ExpenseList } from "@/components/marketing/expense-list";
import { GuideBanner } from "@/components/marketing/guide-banner";
import {
  GuideLink,
  GuideSteps,
  StepCost,
} from "@/components/marketing/guide-steps";
import { NAV_RESOURCES, getResourceGuide } from "@/lib/site";

const GUIDE = getResourceGuide("/florida-cam-license-cost");

/** Section 1. Copy ported verbatim from GUIDE.sourceUrl. */
const HERO = {
  title: "CAM License Cost in Florida (2026 Guide)",
  intro:
    "How much does it cost to get a community association manager license in Florida.",
  /** The original's own banner vector, lifted from its inline SVG. */
  art: { src: "/course/cam-cost-invoice.svg", width: 512, height: 512 },
} as const;

/** Section 2. Copy ported verbatim from GUIDE.sourceUrl. */
const BREAKDOWN_LEAD = [
  CAM_COST_INTRO,
  <strong key="lead-in" className="text-ink-900">
    Here a break down of the costs to obtain your Florida CAM license:
  </strong>,
];

const BREAKDOWN = [
  {
    title: "Pre-Licensing Course",
    body: [
      <StepCost key="cost" amount="$180 – $340" payee=", payable to the school." />,
      "Candidates are required to complete a 16-hour online or classroom pre-licensing course.",
    ],
    actions: [
      {
        label: "Florida Licensing Course",
        href: "/florida-cam-license-course-online",
      },
    ],
  },
  {
    title: "Background Check",
    body: [
      <StepCost
        key="cost"
        amount="$50 – $80"
        payee=", payable to a Livescan Vendor."
      />,
      "You will need to have your fingerprints taken. Florida requires a criminal background checked to approve your initial application. That fee may vary depending on the provider you choose.",
    ],
  },
  {
    title: "Application",
    body: [
      <StepCost
        key="cost"
        amount="$205.50"
        payee=", payable to the Florida DBPR."
      />,
      "You must submit an application to the Florida DBPR. It is recommended to submit the application online to expedite the process. It takes about 10 days to get your application approval.",
    ],
  },
  {
    title: "State Examination",
    body: [
      <StepCost key="cost" amount="$49.50" payee=", payable to Pearson VUE." />,
      <>
        Once your application is approved, you will be able to schedule and take
        the{" "}
        <GuideLink href="/florida-cam-exam-test-flashcards">
          Florida CAM examination
        </GuideLink>
        . The state exam must be taken in person at a Pearson Vue test center.
      </>,
    ],
  },
] as const;

/** Section 4. Copy ported verbatim from GUIDE.sourceUrl. */
const AFTER = {
  title: "After Getting Your License",
  lead: [
    "Obtaining your CAM license is just the first step of your new career in Florida. You’ll need to invest time to maintain your license by completing the required continuing education.",
    <>
      Community Association Managers in Florida are required{" "}
      <GuideLink href="/florida-cam-continuing-education">
        to complete 15 hours of Continuing Education
      </GuideLink>{" "}
      within each renewal period. Notably, all Florida CAM licenses expire on
      September 30 of every even-numbered year. It&apos;s important to remember
      that the next license renewal deadline is September 30, 2026.
    </>,
  ],
} as const;

export const metadata: Metadata = {
  title: HERO.title,
  description: HERO.intro,
  alternates: { canonical: GUIDE.path },
};

export default function Page() {
  return (
    <>
      <GuideBanner
        eyebrow="CAM"
        title={HERO.title}
        intro={HERO.intro}
        art={HERO.art}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: NAV_RESOURCES.href },
          { label: GUIDE.label },
        ]}
      />

      {/* Numbered cost items, not steps to perform. */}
      <GuideSteps lead={BREAKDOWN_LEAD} steps={BREAKDOWN} stepLabel={null} />

      {/* No intro: the same paragraph already opens the breakdown above. */}
      <CostSummary
        title="CAM License Cost Summary (2026)"
        rows={CAM_COST_ROWS}
        caption="Estimated cost of a Florida CAM licence, by item"
        artwork={COST_ARTWORK}
      />

      {/* Prose only here — unlike the real estate guide, this section lists no
          recurring expenses. */}
      <ExpenseList title={AFTER.title} lead={AFTER.lead} />

      <RelatedResources items={CAM_RESOURCES} />
    </>
  );
}
