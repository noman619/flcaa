import type { Metadata } from "next";
import * as React from "react";
import {
  RelatedResources,
  ReciprocityBand,
} from "@/components/course/course-sections";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { HOW_TO_LICENSE_FAQS } from "@/content/course-faqs";
import { HOW_TO_LICENSE_RESOURCES } from "@/lib/course-media";
import { CostSummary } from "@/components/marketing/cost-summary";
import {
  COST_ARTWORK,
  REAL_ESTATE_COST_INTRO,
  REAL_ESTATE_COST_ROWS,
} from "@/content/license-costs";
import { NextSteps } from "@/components/marketing/next-steps";
import { GuideHero } from "@/components/marketing/guide-hero";
import { GuideLink, GuideSteps } from "@/components/marketing/guide-steps";
import { LICENSE_STEP_CARDS } from "@/components/marketing/guide-step-cards";
import { NAV_RESOURCES, getResourceGuide } from "@/lib/site";

const GUIDE = getResourceGuide("/how-to-get-real-estate-license-in-florida");

/** Section 1. Copy ported verbatim from GUIDE.sourceUrl. */
const HERO = {
  title: "How to Get Your Florida Real Estate License (2026 Guide)",
  intro:
    "This guide explains how to get your real estate license in Florida. Follow our simple steps covering all licensing requirements, from the pre-license course to the state exam, and start your career as a sales associate.",
  highlights: [
    "No Florida Residency Required to Get Your License",
    "Take Your Course & Submit Your Application Entirely Online",
    "Get Your License in Less Than 5 Weeks",
    "No College Degree or Prior Experience Required to Qualify",
  ],
  // https://www.youtube.com/watch?v=nrU2UHsx4AY
  video: {
    id: "nrU2UHsx4AY",
    title: "How to Get Your Florida Real Estate License",
  },
  /** The four-step summary graphic. Same order as the detailed run below. */
  stepCards: LICENSE_STEP_CARDS,
} as const;

/** Section 2. Copy ported verbatim from GUIDE.sourceUrl. */
const ELIGIBILITY = {
  title: "Who Is Eligible to Apply?",
  intro: "Before starting, ensure you meet the basic requirements:",
  items: [
    "Be at least 18 years old.",
    "Hold a High School Diploma or equivalent.",
    "Have a valid Social Security Number.",
  ],
  note: "Note: You do NOT need to be a Florida resident or a US Citizen (authorization to work is required).",
} as const;

/** Inline link inside step and card copy. */
const A = GuideLink;

const STEPS = [
  {
    title: "Complete the 63-Hour Florida Pre-License Course",
    body: [
      <>
        All candidates are required to complete{" "}
        <A href="/florida-real-estate-license-course">
          63 hours of online or classroom approved pre-licensing education
        </A>
        .
      </>,
      "In Florida, sales associate licensing courses can be completed online with a state-approved school. The course certification is valid for two (2) years from the date of completion.",
    ],
    actions: [
      { label: "Preview This Course", href: "/florida-real-estate-license-course" },
      {
        kind: "trial",
        label: "Course Free Trial",
        course: "Florida Real Estate License Course",
      },
    ],
  },
  {
    title: "Submit Your Fingerprints for a Background Check",
    body: [
      <>
        Florida requires a criminal background checked before issuing a real
        estate license. Digital fingerprints can be taken at any authorized
        location across the US.{" "}
        <A href="https://fl.state.identogo.com/">Make an appointment online</A>{" "}
        or contact IdentoGO at (800) 528-1358 for more information.
      </>,
      <>
        You can search for an{" "}
        <A href="https://www.identogo.com/locations">
          IdentoGO location by region or ZIP code here
        </A>
        . The Originating Agency Identification (ORI) number to provide for real
        estate licenses is FL920010Z. If you have a criminal history, your
        application will be reviewed on its own merit to determine if the good
        moral character requirement has been met.
      </>,
    ],
  },
  {
    title: "Apply for Your License with the DBPR",
    body: [
      <>
        <A href="https://www.myfloridalicense.com/CheckListDetail.asp?SID=&xactCode=1010&clientCode=2501&XACT_DEFN_ID=744">
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
    title: "Pass the Official Florida Real Estate State Exam",
    body: [
      <>
        After receiving your approval confirmation and candidate ID number
        (FLREAPP ID) by email, you can schedule your state exam. Florida uses
        Pearson VUE to manage and oversee their real estate license tests. The
        exam is available daily at Pearson VUE test centers across United
        States. To register, call Pearson VUE at 888-204-6230 or{" "}
        <A href="https://home.pearsonvue.com/fl/dbpr">visit their website</A>.
      </>,
      <>
        You have 3.5 hours to answer 100 multiple-choice questions (a, b, c, d).
        The passing score is 75%. You can retake the Florida state exam as many
        times as you wish. You simply need to wait 24 hours to reschedule the
        examination. More information regarding the Florida real estate license
        examination is available in{" "}
        <A href="/docs/fl-real-estate-candidate-information-booklet.pdf">
          the candidate information booklet
        </A>
        .
      </>,
    ],
    actions: [
      {
        label: "Exam Prep Program",
        href: "/florida-real-estate-practice-exam",
      },
    ],
  },
] as const;

/** Section 3. Copy ported verbatim from GUIDE.sourceUrl. */
const COST = {
  title: "Real Estate License Cost Summary",
  titleHref: "/real-estate-license-florida-cost",
  intro: REAL_ESTATE_COST_INTRO,
  rows: REAL_ESTATE_COST_ROWS,
  artwork: COST_ARTWORK,
} as const;

/** Section 4. Copy and links ported verbatim from GUIDE.sourceUrl. */
const NEXT_STEPS = {
  title: "You Have Passed the State Exam. Now What?",
  steps: [
    {
      title: "Affiliate with a broker",
      icon: { src: "/course/next-affiliate-broker.svg" },
      body: (
        <p>
          Once you have successfully passed the state exam, you will be set{" "}
          <A href="http://myfloridalicense.custhelp.com/app/answers/detail/a_id/1818/related/1/session/L2F2LzEvdGltZS8xNjEwMjAyNDUzL3NpZC9BUWxtLUQqbw%3D%3D">
            to activate your license
          </A>{" "}
          and launch your real estate career. A sales associate can only operate
          with one employing broker at a time. The license can be activated
          through your broker or by{" "}
          <A href="/docs/dbpr-re-11-sales-associate-broker-transaction.pdf">
            submitting the DBPR-RE 11 form
          </A>
          .
        </p>
      ),
    },
    {
      title: "Connect with a local Realtor® association",
      icon: { src: "/course/next-realtor-association.svg" },
      body: (
        <p>
          <A href="https://www.nar.realtor/leadrshp.nsf/webassoc?OpenView&Start=1&Count=30&Expand=10#10">
            State local boards
          </A>{" "}
          offer several success opportunities. You will also become a member of
          the{" "}
          <A href="https://www.nar.realtor/">
            National Association of Realtors
          </A>
          ®.
        </p>
      ),
    },
    {
      title: "Complete Your Florida Real Estate 45-Hour Post-Licensing Course",
      icon: { src: "/course/next-post-licensing.svg" },
      body: (
        <p>
          Prior to your first license renewal deadline, you must{" "}
          <A href="/courses/re-45-sales-associate-post">
            complete 45 hours of post-licensing education
          </A>
          .
        </p>
      ),
    },
  ],
} as const;

/**
 * Section 5. The original's button points at the mutual-recognition course,
 * which is the page we already have.
 */
const RECIPROCITY = {
  question: "Do you hold a real estate license in another state?",
  action: {
    label: "License Reciprocity",
    href: "/florida-real-estate-mutual-recognition-exam-prep",
  },
} as const;

/**
 * The handout under the steps. Served from our own domain rather than the
 * original's Wix file store, so it survives that site going away.
 * Source: /_files/ugd/0df54e_e5c8beb2584646b6a8b8adc357bbc9c8.pdf
 */
const DOWNLOAD = {
  label: "Download the 4 Steps",
  href: "/docs/4-steps-to-your-florida-real-estate-license.pdf",
  fileName: "4-steps-to-your-florida-real-estate-license.pdf",
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
        eyebrow="Real Estate"
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

      <GuideSteps
        eligibility={ELIGIBILITY}
        steps={STEPS}
        download={DOWNLOAD}
      />

      <CostSummary
        title={COST.title}
        titleHref={COST.titleHref}
        intro={COST.intro}
        rows={COST.rows}
        caption="Estimated cost of a Florida real estate licence, by item"
        artwork={COST.artwork}
      />

      <NextSteps title={NEXT_STEPS.title} steps={NEXT_STEPS.steps} />

      <ReciprocityBand
        question={RECIPROCITY.question}
        action={RECIPROCITY.action}
      />

      <FaqAccordion
        items={HOW_TO_LICENSE_FAQS}
        title="Frequently Asked Questions"
        tone="dark"
        icon={{ src: "/course/faq-bubbles.png", width: 596, height: 476 }}
      />

      <RelatedResources items={HOW_TO_LICENSE_RESOURCES} />
    </>
  );
}
