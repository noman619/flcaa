import type { Metadata } from "next";
import { RelatedResources } from "@/components/course/course-sections";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { HOW_TO_CAM_LICENSE_FAQS } from "@/content/course-faqs";
import {
  CAM_COST_INTRO,
  CAM_COST_ROWS,
  COST_ARTWORK,
} from "@/content/license-costs";
import { CAM_RESOURCES } from "@/lib/course-media";
import { CostSummary } from "@/components/marketing/cost-summary";
import { GuideHero } from "@/components/marketing/guide-hero";
import { LICENSE_STEP_CARDS } from "@/components/marketing/guide-step-cards";
import { GuideLink, GuideSteps } from "@/components/marketing/guide-steps";
import { NAV_RESOURCES, getResourceGuide } from "@/lib/site";

const GUIDE = getResourceGuide("/how-get-cam-license-florida");

/** Section 1. Copy ported verbatim from GUIDE.sourceUrl. */
const HERO = {
  title: "How to Get Your Florida CAM License in 2026",
  intro:
    "Discover how to become a community association manager in Florida. Explore the licensing requirements to succeed as a CAM in the Sunshine State.",
  highlights: [
    "Florida residency is not required",
    "Complete the process mostly online",
    "Get your license in less than 5 weeks",
  ],
  // https://www.youtube.com/watch?v=CwITZxgvygk
  video: {
    id: "CwITZxgvygk",
    title:
      "How to Get My Community Association Manager (CAM) License in Florida",
  },
  /** The same four steps as the real estate guide, in the same order. */
  stepCards: LICENSE_STEP_CARDS,
} as const;

/** Section 2. Copy ported verbatim from GUIDE.sourceUrl. */
const ELIGIBILITY = {
  title: "Who Is Eligible to Apply?",
  intro: "Before starting, ensure you meet the basic requirements:",
  items: ["Be at least 18 years old.", "Have a valid Social Security Number."],
  note: "Note: You do NOT need to be a Florida resident or a US Citizen (authorization to work is required).",
} as const;

const A = GuideLink;

const STEPS = [
  {
    title: "Take and Pass a Pre-License Course",
    body: [
      "All candidates are required to complete 16 hours of online or classroom approved pre-licensing education.",
      "In Florida, all required CAM license courses can be completed online with a state-approved school. The course certification is valid for one (1) years from the date of completion.",
    ],
    actions: [
      { label: "Preview This Course", href: "/florida-cam-license-course-online" },
      {
        kind: "trial",
        label: "Course Free Trial",
        course: "Florida CAM License Course",
      },
    ],
  },
  {
    title: "Get Your Fingerprints Taken",
    body: [
      <>
        Florida State requires electronic fingerprints be taken and criminal
        background checked before issuing a CAM License. Digital fingerprints
        can be taken at any authorized location across the U.S.{" "}
        <A href="https://fl.state.identogo.com/">Make an appointment online</A>{" "}
        or contact IdentoGO at (800) 528-1358 for more information.
      </>,
      <>
        You can search for an{" "}
        <A href="https://www.identogo.com/locations">
          IdentoGO location by region or ZIP code here
        </A>
        . The Originating Agency Identification (ORI) number to provide for CAM
        licenses is FL921932Z. If you have a criminal history, your application
        will be reviewed on its own merit to determine if the good moral
        character requirement has been met.
      </>,
    ],
  },
  {
    title: "Submit Your Application",
    body: [
      <>
        <A href="https://www.myfloridalicense.com/CheckListDetail.asp?SID=&xactCode=1010&clientCode=3801&XACT_DEFN_ID=6440">
          Submit your application online
        </A>{" "}
        or using a printable form to the Florida DBPR. It takes about 10 days to
        get your application approval. Once approved, you will receive an email
        notification and a candidate ID number (FLREAPP ID) in order to schedule
        your state exam.
      </>,
    ],
  },
  {
    title: "Schedule and Pass the State Exam",
    body: [
      "After receiving your approval confirmation and candidate ID number (FLREAPP ID) by email, you can schedule your state exam. Florida uses Pearson VUE to manage and oversee their CAM license tests.",
      <>
        The exam is available daily at Pearson VUE test centers across United
        States. To register, call Pearson VUE at 888-204-6230 or{" "}
        <A href="https://home.pearsonvue.com/fl/dbpr">visit their website</A>.
      </>,
      <>
        You have 3 hours to answer 100 multiple-choice questions (a, b, c, d).
        The passing score is 75%. You can retake the Florida state exam as many
        times as you wish. You simply need to wait 24 hours to reschedule the
        examination. More information regarding the Florida CAM license
        examination is available in{" "}
        <A href="http://www.myfloridalicense.com/dbpr/servop/testing/documents/cam_cib.pdf">
          the candidate information booklet
        </A>
        .
      </>,
    ],
    actions: [
      { label: "Exam Prep Program", href: "/florida-cam-exam-test-flashcards" },
    ],
  },
] as const;

/** Section 3. Copy ported verbatim from GUIDE.sourceUrl. */
const COST = {
  title: "CAM License Cost Summary (2026)",
  titleHref: "/florida-cam-license-cost",
  intro: CAM_COST_INTRO,
  rows: CAM_COST_ROWS,
  // The same calculator the real estate guide carries; the original reuses it.
  artwork: COST_ARTWORK,
} as const;

export const metadata: Metadata = {
  title: HERO.title,
  description: GUIDE.description,
  alternates: { canonical: GUIDE.path },
};

export default function Page() {
  return (
    <>
      <GuideHero
        eyebrow="CAM"
        title={HERO.title}
        intro={HERO.intro}
        highlights={HERO.highlights}
        video={HERO.video}
        steps={HERO.stepCards}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: NAV_RESOURCES.href },
          { label: GUIDE.label },
        ]}
      />

      <GuideSteps eligibility={ELIGIBILITY} steps={STEPS} />

      <CostSummary
        title={COST.title}
        titleHref={COST.titleHref}
        intro={COST.intro}
        rows={COST.rows}
        caption="Estimated cost of a Florida CAM licence, by item"
        artwork={COST.artwork}
      />

      <FaqAccordion
        items={HOW_TO_CAM_LICENSE_FAQS}
        title="Frequently Asked Questions"
        tone="sand"
        align="center"
      />

      <RelatedResources items={CAM_RESOURCES} title="Recent Posts" />
    </>
  );
}
