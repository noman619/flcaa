import type { Metadata } from "next";
import {
  LegalDocument,
  LegalLink,
  type LegalSection,
} from "@/components/marketing/legal-document";
import { SITE } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/terms-of-use               */
/* -------------------------------------------------------------------------- */

const PAGE = {
  title: "Terms of Use – Prolicense Florida",
  effective: "Effective Date: January 01, 2026",
} as const;

const SECTIONS: readonly LegalSection[] = [
  {
    title: "Agreement to Terms",
    blocks: [
      {
        kind: "p",
        body: "By accessing Prolicense Florida’s website or courses (“Services”), you agree to these Terms.",
      },
    ],
  },
  {
    title: "Modifications",
    blocks: [
      {
        kind: "p",
        body: "We may update this Agreement; changes apply upon posting with a new “Last Revised” date.",
      },
    ],
  },
  {
    title: "Services & Related Policies",
    blocks: [
      {
        kind: "p",
        body: "Our Services include real estate, CAM, board certification, and related materials. Your use also means agreement with our:",
      },
      {
        kind: "list",
        items: [
          <>
            <LegalLink href="/privacy">Privacy Policy</LegalLink> (see Section 5)
          </>,
          <>
            <LegalLink href="/sms-terms">SMS Terms &amp; Conditions</LegalLink>{" "}
            (Section 6.2)
          </>,
        ],
      },
    ],
  },
  {
    title: "Eligibility & Account Requirements",
    blocks: [
      {
        kind: "list",
        items: [
          "Must be at least 18 and able to form a binding contract.",
          "You are responsible for your account credentials and for keeping them secure.",
        ],
      },
    ],
  },
  {
    title: "Privacy & Data Use",
    blocks: [
      {
        kind: "list",
        items: [
          <>
            We collect and use your personal data as outlined in our{" "}
            <LegalLink href="/privacy">Privacy Policy</LegalLink>.
          </>,
          <>
            SMS communications are covered under our{" "}
            <LegalLink href="/sms-terms">SMS Terms &amp; Conditions</LegalLink>.
          </>,
        ],
      },
    ],
  },
  {
    title: "SMS Program",
    blocks: [
      {
        kind: "list",
        items: [
          <>
            Governed by separate{" "}
            <LegalLink href="/sms-terms">SMS Terms &amp; Conditions</LegalLink>.
          </>,
          "You consent to receive SMS if enrolled (see Section 2.3 of SMS Terms) and may opt-out at any time using STOP.",
          "Does not override your rights under the Privacy Policy.",
        ],
      },
    ],
  },
  {
    title: "Intellectual Property",
    blocks: [
      {
        kind: "list",
        items: [
          "All content is owned by Prolicense or licensed to it.",
          "You receive a personal, non-transferable license to access the Services.",
          "User-generated content must be original and legal; we may remove infringing content under DMCA.",
        ],
      },
    ],
  },
  {
    title: "User Conduct Rules",
    blocks: [
      { kind: "p", body: "You may not:" },
      {
        kind: "list",
        items: [
          "Violate laws (e.g., fraud, harassment).",
          "Reverse-engineer the platform.",
          "Distribute harmful code or manipulate systems.",
        ],
      },
    ],
  },
  {
    title: "Payments & Refunds",
    blocks: [
      {
        kind: "p",
        body: (
          <>
            Course fees are charged upfront.{" "}
            <LegalLink href="/returns-refunds">Refunds</LegalLink> follow the
            policy specified per course.
          </>
        ),
      },
    ],
  },
  {
    title: "Disclaimer & Warranty",
    blocks: [
      {
        kind: "list",
        items: [
          "Services are provided “AS IS” with no warranties.",
          "We do not guarantee results or licensure success.",
        ],
      },
    ],
  },
  {
    title: "Limitation of Liability",
    blocks: [
      {
        kind: "list",
        items: [
          "Our total liability is limited to the amount you paid for the Services.",
          "We’re not liable for indirect losses.",
        ],
      },
    ],
  },
  {
    title: "Indemnification",
    blocks: [
      {
        kind: "p",
        body: "You agree to indemnify us against any claim related to your use or violation of these terms.",
      },
    ],
  },
  {
    title: "Termination",
    blocks: [
      {
        kind: "list",
        items: [
          "We reserve the right to terminate or suspend accounts at our discretion.",
          "Sections 7–13 survive termination.",
        ],
      },
    ],
  },
  {
    title: "Governing Law & Disputes",
    blocks: [
      {
        kind: "list",
        items: [
          "Governed by Florida law.",
          "Exclusive venue: courts in Broward County, FL.",
          "Mandatory arbitration for disputes, class-action waiver.",
        ],
      },
    ],
  },
  {
    title: "Miscellaneous",
    blocks: [
      {
        kind: "list",
        items: [
          "Not an employment or partnership agreement.",
          "Assignment by us is permitted; not by you.",
          "Force Majeure applies; if invalid, strikes down only that part.",
        ],
      },
    ],
  },
  {
    title: "Contact",
    blocks: [
      {
        kind: "p",
        body: (
          <>
            Prolicense Education LLC
            <br />
            919 NE 24th Avenue, Hallandale Beach, FL 33009
            <br />
            <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink>
            <br />
            <LegalLink href={`mailto:${SITE.email}`}>{SITE.email}</LegalLink>
          </>
        ),
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing your use of Prolicense Florida courses, accounts and website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalDocument
      breadcrumb="Terms of Use"
      title={PAGE.title}
      effective={PAGE.effective}
      sections={SECTIONS}
    />
  );
}
