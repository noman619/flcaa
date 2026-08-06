import type { Metadata } from "next";
import Link from "next/link";
import { HandCoins, Timer } from "lucide-react";
import { RelatedResources } from "@/components/course/course-sections";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { HOW_TO_LICENSE_RESOURCES } from "@/lib/course-media";
import { CostSummary } from "@/components/marketing/cost-summary";
import {
  COST_ARTWORK,
  REAL_ESTATE_COST_ROWS,
} from "@/content/license-costs";
import { ExpenseList } from "@/components/marketing/expense-list";
import { GuideBanner } from "@/components/marketing/guide-banner";
import {
  GuideLink,
  GuideSteps,
  StepCost,
} from "@/components/marketing/guide-steps";
import { NAV_RESOURCES, getResourceGuide } from "@/lib/site";

const GUIDE = getResourceGuide("/real-estate-license-florida-cost");

/** Section 1. Copy ported verbatim from GUIDE.sourceUrl. */
const HERO = {
  title: "Real Estate License Cost in Florida (2026 Guide)",
  intro: "How much does it cost to get a real estate license in Florida.",
  /** The original's own banner vector, lifted from its inline SVG. */
  art: { src: "/course/cost-gears-dollar.svg", width: 512, height: 512 },
} as const;

/** Section 2. Copy ported verbatim from GUIDE.sourceUrl. */
const BREAKDOWN_LEAD = [
  "To obtain your real estate license in Florida in 2026, you should expect to spend between $270 and $690, covering the costs of the pre-licensing course, background check, application fee, and the state examination. The total cost varies significantly depending on the format of the pre-licensing course you choose (self-paced vs. classroom) and the complexity of your criminal background check.",
  <strong key="lead-in" className="text-ink-900">
    Here a break down of the costs to obtain your Florida real estate license:
  </strong>,
];

const BREAKDOWN = [
  {
    title: "Pre-Licensing Course",
    body: [
      <StepCost
        key="cost"
        amount="$100 – $500"
        payee=", payable to the school. This amount may vary depending on the education provider."
      />,
      "Candidates are required to complete a 63-hour online or classroom pre-licensing course.",
    ],
    actions: [
      {
        label: "Florida Licensing Course",
        href: "/florida-real-estate-license-course",
      },
    ],
  },
  {
    title: "Background Check",
    body: [
      <StepCost
        key="cost"
        amount="$50 – $80"
        payee={', payable to an approved "Livescan" vendor.'}
      />,
      "You will need to have your fingerprints taken. Florida requires a criminal background checked to approve your initial application. That fee may vary depending on the provider you choose.",
    ],
  },
  {
    title: "Application",
    body: [
      <StepCost key="cost" amount="$83.75" payee=", payable to the Florida DBPR." />,
      "You must submit an application to the Florida DBPR. It is recommended to submit the application online to expedite the process. It takes about 10 days to get your application approval.",
    ],
  },
  {
    title: "State Examination",
    body: [
      <StepCost key="cost" amount="$36.75" payee=", payable to Pearson VUE" />,
      <>
        Once your application is approved, you will be able to schedule and take
        the{" "}
        <GuideLink href="/florida-real-estate-exam">
          Florida real estate examination
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
    <>
      <GuideLink href="/how-to-get-real-estate-license-in-florida">
        Obtaining your real estate license
      </GuideLink>{" "}
      is just the first step of your new career in Florida. You’ll need to
      invest time and money to maintain your license and be competitive on the
      real estate market.
    </>,
    "Still, it’s a small price to pay when you consider how lucrative a career in Florida real estate can be. Remember, you’re essentially launching your own business and it obviously involves some fees. Most of these expenses are tax-deductible. Moreover, all of your initial expenses will pay for themselves when you close your first deal.",
  ],
  note: "Here are some of the most common expenses as a active real estate agent in Florida:",
  items: [
    {
      title: "Realtors® Membership",
      cost: "Estimated Cost: $250 per Year",
      body: [
        "There are many benefits of becoming a member of your local Realtor® association. In doing so, real estate agents are included in the National Association of Realtors listing and given access to useful tools and information such as the multiple listings service (MLS).",
      ],
    },
    {
      title: "Post-Licensing Education",
      cost: "Estimated Cost: $109",
      body: [
        "All new Florida real estate agents must complete 45 hours of post-licensing education prior to their first renewal deadline.",
        "The license renewal date is between 18 and 24 months after receiving their initial license. The education contains practical instructions and information about real estate business planning, marketing, prospecting, and closing the transaction.",
      ],
    },
    {
      title: "Business Expenses",
      cost: "Estimated Cost: $900 per Year",
      body: [
        "There are several business expenses real estate agents should expect to pay to maintain regular operations in Florida. These may include the cost of an office space, phone, internet, computer, client meetings, and more.",
        "Essentially, business expenses refer to anything you need to spend to be efficient and competitive as a real estate agent. These costs may vary depending on your business plan and location.",
      ],
    },
    {
      title: "Marketing Costs",
      cost: "Estimated Cost: $1,000 per Year",
      body: [
        "Marketing yourself as a real estate agent is the most important aspect of a successful career. This means getting the word out about how you can help potential clients. A few costs to consider include business cards, a website and various types of advertisements (social media, flyers, boards, etc.).",
      ],
    },
    {
      title: "Professional Liability Insurance",
      cost: "Estimated Cost: $1,100 per Year",
      body: [
        "Many potential clients require proof of professional liability insurance before contracting with a real estate agent. This policy, also called errors and omissions insurance (E&O), can help cover legal expenses if a real estate agent is sued for unsatisfactory performance or a work mistake.",
      ],
    },
    {
      title: "Continuing Education",
      cost: "Estimated Cost: $100 Every Two Years",
      body: [
        "Continuing education will be required for the rest of your real estate career. Florida real estate agent must complete 14 hours of continuing education every 2 years, based on their license expiration date.",
      ],
    },
  ],
} as const;

/**
 * Section 6. The same three posts as the how-to guide — same hrefs, same
 * images — but this page titles the middle card "…in Florida", so the shared
 * set is spread with that one label overridden rather than forked.
 */
const RESOURCES = [
  HOW_TO_LICENSE_RESOURCES[0],
  {
    ...HOW_TO_LICENSE_RESOURCES[1],
    title: "Difference Between a Real Estate Agent and a Broker in Florida",
  },
  HOW_TO_LICENSE_RESOURCES[2],
] as const;

/** Section 5. Copy ported verbatim from GUIDE.sourceUrl. */
const CLOSING_FAQS = [
  {
    q: "How Long Does it take to become a real estate agent in Florida?",
    text: "It takes generally from 10 to 20 weeks to get a real estate agent license in Florida. However, if you plan diligently, you can get the entire process done in less than 5 weeks.",
    icon: Timer,
    a: (
      <p>
        It takes generally from 10 to 20 weeks to get a real estate agent
        license in Florida. However, if you plan diligently, you can{" "}
        <Link href="/blog/florida-real-estate-license-fast">
          get the entire process done in less than 5 weeks
        </Link>
        .
      </p>
    ),
  },
  {
    q: "How Much Do Real Estate Agents Make in Florida?",
    text: "The average income of real estate agents in Florida ranges from $24,856 to $162,283. These earnings vary depending on location, experience, specialty, and average hours worked.",
    icon: HandCoins,
    a: (
      <p>
        The{" "}
        <Link href="/florida-real-estate-agent-income-benefits">
          average income of real estate agents in Florida
        </Link>{" "}
        ranges from $24,856 to $162,283. These earnings vary depending on
        location, experience, specialty, and average hours worked.
      </p>
    ),
  },
] as const;

export const metadata: Metadata = {
  title: HERO.title,
  description: HERO.intro,
  alternates: { canonical: GUIDE.path },
};

export default function Page() {
  return (
    <>
      <GuideBanner
        eyebrow="Real Estate"
        title={HERO.title}
        intro={HERO.intro}
        art={HERO.art}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: NAV_RESOURCES.href },
          { label: GUIDE.label },
        ]}
      />

      {/* Numbered cost items, not steps to perform — the badge carries the
          figure alone, as on the exam guide. */}
      <GuideSteps lead={BREAKDOWN_LEAD} steps={BREAKDOWN} stepLabel={null} />

      {/* No intro here, unlike the how-to guide: the same paragraph already
          opens the breakdown above. */}
      <CostSummary
        title="Real Estate License Cost Summary (2026)"
        rows={REAL_ESTATE_COST_ROWS}
        caption="Estimated cost of a Florida real estate licence, by item"
        artwork={COST_ARTWORK}
      />

      <ExpenseList
        title={AFTER.title}
        lead={AFTER.lead}
        note={AFTER.note}
        items={AFTER.items}
      />

      {/* No heading on the original — the bubble artwork stands in for one. */}
      <FaqAccordion
        items={CLOSING_FAQS}
        title={null}
        tone="dark"
        icon={{ src: "/course/faq-bubbles.png", width: 596, height: 476 }}
      />

      <RelatedResources items={RESOURCES} />
    </>
  );
}
