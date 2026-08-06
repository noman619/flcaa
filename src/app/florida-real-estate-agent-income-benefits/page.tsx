import type { Metadata } from "next";
import { RelatedResources } from "@/components/course/course-sections";
import { GuideLink } from "@/components/marketing/guide-steps";
import { HOW_TO_LICENSE_RESOURCES } from "@/lib/course-media";
import { IconFeatures } from "@/components/marketing/icon-features";
import { PhotoHero } from "@/components/marketing/photo-hero";
import {
  TopicBlocks,
  TopicChart,
  TopicTable,
} from "@/components/marketing/topic-blocks";
import { NAV_RESOURCES, getResourceGuide } from "@/lib/site";

const GUIDE = getResourceGuide("/florida-real-estate-agent-income-benefits");

/** Section 1. Copy ported verbatim from GUIDE.sourceUrl. */
const HERO = {
  title: "How Much Do Real Estate Agents Make in Florida?",
  intro:
    "The U.S. Bureau of Labor Statistics, in 2025, reported the average income of real estate agents in Florida ranges from $24,856 to $162,283. These earnings vary depending on location, experience, specialty, and average hours worked. These figures are averages, and understand that very top producers in Florida make well over a million dollars of income each year.",
  /** The original's own banner photograph, served from our own domain. */
  image: { src: "/course/income-hero.jpg", width: 1920, height: 720 },
} as const;

/** Section 2. Copy, figures and artwork ported verbatim from GUIDE.sourceUrl. */
const INCOME_BY_CITY = [
  ["Jacksonville", "$83,956"],
  ["Miami Beach", "$85,985"],
  ["Tampa Bay", "$83,418"],
  ["Saint Petersburg", "$77,907"],
  ["Orlando", "$79,623"],
  ["Port St. Lucie", "$84,417"],
  ["Cape Coral", "$79,136"],
  ["Tallahassee", "$75,926"],
  // The original lists Saint Petersburg twice, against different figures.
  ["Saint Petersburg", "$77,970"],
  ["Fort Lauderdale", "$81,620"],
] as const;

const TOPICS = [
  {
    title: "Real Estate Agent Income by Experience",
    icon: { src: "/course/icon-experience.png", width: 208, height: 212 },
    media: (
      <TopicChart
        src="/course/income-by-experience.jpg"
        alt="Agent income rises with experience, from under $20,000 in the first year to over $80,000 after sixteen years"
        width={1356}
        height={984}
      />
    ),
    body: [
      "The initial year in real estate is the hardest, but agents who persevere will earn the benefits of their work in just a few years. A supportive broker and a growing network will pay off as you establish your business.",
      <>
        In Florida, all real estate candidates must first{" "}
        <GuideLink href="/florida-real-estate-license-course">
          complete 63-hour of approved pre-licensing education
        </GuideLink>{" "}
        to get their license.
      </>,
    ],
  },
  {
    title: "Real Estate Agent Income by Location",
    icon: { src: "/course/icon-map.png", width: 180, height: 180 },
    media: (
      <TopicTable
        columns={["City", "Annual Income"]}
        rows={INCOME_BY_CITY}
        caption="Average annual real estate agent income by Florida city"
      />
    ),
    body: [
      "There are some distinct variations in real estate agents earnings depending on which metropolitan area realtors©️ are working in. According to the Bureau of Labor Statistics, agents in Tampa earn an average of $83,418 annually, however further north in Tallahassee, the average salary per year stands at $75,926. Average annual earnings come out at $85,985 in Miami Beach, but in Port St. Lucie, agents average salaries of $84,417 a year. The Fort Lauderdale area boasts the agent income, standing at $81,620 per year on average.",
    ],
  },
  {
    title: "Real Estate Agent Income by Hours Worked",
    icon: { src: "/course/icon-hours.png", width: 200, height: 200 },
    media: (
      <TopicChart
        src="/course/income-by-hours.jpg"
        alt="Annual income rises with hours worked per week, from about $24,000 part-time to over $72,000 full-time"
        width={1684}
        height={1052}
      />
    ),
    body: [
      "For full-time agent, the average gross income was $72,247, compared to $24,298 for part-time agent. While real estate gives you the opportunity of a flexible schedule, those who put in more hours, achieve their full earning potential.",
    ],
  },
  {
    title: "Real Estate Agent Income by Specialties",
    icon: { src: "/course/icon-specialty.png", width: 232, height: 232 },
    media: (
      <TopicChart
        src="/course/income-by-specialty.jpg"
        alt="Average income by specialty, lowest for residential rentals and highest for luxury and international properties"
        width={1616}
        height={702}
      />
    ),
    body: [
      "Real estate agents who focus on one specialization earn more than agents who don’t associate themselves with a particular niche. The most profitable specializations are luxury real estate, foreign investments, short sales and foreclosures, and green or eco-friendly properties.",
    ],
  },
] as const;

/** Section 3. Copy ported verbatim from GUIDE.sourceUrl. */
const BENEFITS = {
  title: "Real Estate Agent Benefits and Advantages",
  intro:
    "In addition to a higher-than-average salary, these are some of the other awesome benefits that a career in real estate offers.",
  items: [
    {
      heading: "The ability to work from home",
      icon: "/course/benefit-work-from-home.svg",
      text: "You’re self-employed now! While you may wish to have an office, you have the freedom to take care of most of your work at home (or anywhere else for that matter).",
    },
    {
      heading: "A flexible schedule",
      icon: "/course/benefit-flexible-schedule.svg",
      text: "We’ve already mentioned that the time you put in is often a large determinant of your salary. That being said, your schedule is now your own. Even with a high-tempo work week, you’ll have the flexibility to work at the times that work best for you.",
    },
    {
      heading: "Professional development",
      icon: "/course/benefit-professional-development.svg",
      text: "There is no end to the professional development opportunities you have as a real estate agent. Whether it’s courses, seminars, business experience, coaching, mentoring, or public speaking, the real estate community abounds with sources of knowledge and development.",
    },
    {
      heading: "A community",
      icon: "/course/benefit-community.svg",
      text: "Within the real estate career field, there is a wide community of like-minded people to connect with. Everyone from investors to brokers to building contractors become a part of your network over time. Additionally, your clients will come from all walks of life. Not only will you become a contact for them, you’ll quickly find how useful it is to meet, and develop a relationship with, so many members of your community.",
    },
    {
      heading: "Tax-deductible expenses",
      icon: "/course/benefit-tax-deductible.svg",
      text: "Because you’re self-employed, you’ll be required to pay self-employment taxes. However, this also means that anything you purchase for your business is now tax deductible. This includes travel for sales calls, business equipment, and professional development costs.",
    },
  ],
  footnote:
    "Should you start a career as a real estate agent in Florida? It all depends on who you are. If you want a flexible schedule, can develop the discipline to put the necessary hours in, and enjoy working with members of your community, then starting a career as a real estate agent is an excellent opportunity.",
} as const;

/**
 * Section 4. Two cards are the shared trio's; the middle one is this page's
 * own. On the original that card links to the home page — almost certainly a
 * slip, since its title promises the online course — so it points at the
 * course here instead of a dead end.
 */
const POSTS = [
  HOW_TO_LICENSE_RESOURCES[0],
  {
    title: "Get Your Florida Real Estate License Entirely Online",
    image: "/course/res-license-online.png",
    href: "/florida-real-estate-license-course",
  },
  HOW_TO_LICENSE_RESOURCES[2],
] as const;

export const metadata: Metadata = {
  title: HERO.title,
  description: GUIDE.description,
  alternates: { canonical: GUIDE.path },
};

export default function Page() {
  return (
    <>
      <PhotoHero
        title={HERO.title}
        intro={HERO.intro}
        image={HERO.image}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: NAV_RESOURCES.href },
          { label: GUIDE.label },
        ]}
      />

      <TopicBlocks items={TOPICS} />

      <IconFeatures
        title={BENEFITS.title}
        intro={BENEFITS.intro}
        features={BENEFITS.items}
        footnote={BENEFITS.footnote}
        columns={3}
      />

      <RelatedResources items={POSTS} title="Recent Posts" />
    </>
  );
}
