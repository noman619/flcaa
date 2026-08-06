import type { Metadata } from "next";
import * as React from "react";
import {
  LegalDocument,
  LegalLink,
  type LegalSection,
} from "@/components/marketing/legal-document";
import { SITE } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/privacy-policy             */
/* -------------------------------------------------------------------------- */

const PAGE = {
  title: "Privacy Policy – Prolicense Education LLC",
  effective: "Effective Date: January 01, 2026",
} as const;

const SECTIONS: readonly LegalSection[] = [
  {
    title: "Introduction",
    blocks: [
      {
        kind: "p",
        body: "This Privacy Policy describes how Prolicense Education LLC (“Prolicense Florida,” “we,” “our,” or “us”) collects, uses, discloses, and protects your personal information. It applies to all users of our websites, course platforms, and SMS communications in the United States, including users in Florida, California, and other states with privacy legislation.",
      },
      {
        kind: "p",
        body: (
          <>
            By using our services, you agree to the terms of this Privacy
            Policy, as well as our <LegalLink href="/terms">Terms of Use</LegalLink> and{" "}
            <LegalLink href="/sms-terms">SMS Terms</LegalLink>, which are
            incorporated by reference.
          </>
        ),
      },
    ],
  },
  {
    title: "Information We Collect",
    blocks: [
      {
        kind: "p",
        body: "We collect the following categories of personal information:",
      },
      {
        kind: "group",
        heading: "A. Identifiers",
        items: [
          "Full name, email address, postal address, phone number",
          "Government-issued ID (if required for verification or certification)",
        ],
      },
      {
        kind: "group",
        heading: "B. Course & Transaction Data",
        items: [
          "Enrollment history, course progress, exam results, certificates",
          "Payment and billing data (via third-party processors)",
        ],
      },
      {
        kind: "group",
        heading: "C. Technical & Usage Data",
        items: [
          "IP address, browser type, operating system, device ID",
          "Cookies, interaction data, session logs",
        ],
      },
      {
        kind: "group",
        heading: "D. Communications",
        items: [
          "Customer support records, feedback, SMS correspondence",
          "Marketing and promotional preferences",
        ],
      },
      {
        kind: "group",
        heading: "E. Sensitive Personal Information (where applicable)",
        items: [
          "Demographic details for compliance reporting",
          "Geolocation or biometric data (only if explicitly required and consented)",
        ],
      },
    ],
  },
  {
    title: "How We Use Your Information",
    blocks: [
      {
        kind: "p",
        body: "We use the data we collect for the following business and commercial purposes:",
      },
      {
        kind: "list",
        items: [
          <>
            <strong>Account management:</strong> User registration, profile
            setup, course access
          </>,
          <>
            <strong>Transaction processing:</strong> Payments, confirmations,
            receipts
          </>,
          <>
            <strong>Certification and compliance:</strong> Reporting to state
            agencies and regulators
          </>,
          <>
            <strong>Customer support:</strong> Technical assistance and general
            inquiries
          </>,
          <>
            <strong>Marketing:</strong> Email/SMS promotions with prior opt-in
            consent
          </>,
          <>
            <strong>Security and fraud prevention:</strong> Account monitoring
            and abuse detection
          </>,
          <>
            <strong>Legal compliance:</strong> Responses to subpoenas, court
            orders, or lawful requests
          </>,
        ],
      },
    ],
  },
  {
    title: "How We Share Your Information",
    blocks: [
      {
        kind: "p",
        body: "We do not sell your personal information. However, we may share your information in the following ways:",
      },
      {
        kind: "group",
        heading: "A. With Service Providers",
        body: "We share information with third-party providers who perform services on our behalf, such as:",
        items: ["Hosting, payment processing, analytics, SMS delivery"],
      },
      {
        kind: "group",
        heading: "B. Legal Requirements",
        body: "We may disclose personal information if required to:",
        items: [
          "Comply with laws or respond to valid legal processes",
          "Protect our legal rights or defend against legal claims",
        ],
      },
      {
        kind: "group",
        heading: "C. Business Transfers",
        body: "Your data may be transferred in the event of a business merger, acquisition, or asset sale.",
      },
      {
        kind: "group",
        heading: "D. Educational/Regulatory Reporting",
        body: "For license verification and regulatory reporting, information may be shared with appropriate state agencies or teaching partners, in accordance with applicable laws.",
      },
    ],
  },
  {
    title: "Your Rights & Choices",
    blocks: [
      {
        kind: "p",
        body: "Depending on your state of residence, you may have the following rights:",
      },
      {
        kind: "group",
        heading: "A. Access & Portability",
        body: "You can request a copy of the personal data we have on file.",
      },
      {
        kind: "group",
        heading: "B. Correction & Deletion",
        body: "You may request correction of inaccurate data or deletion of your personal information.",
      },
      {
        kind: "group",
        heading: "C. Opt-Out of Sale/Sharing",
        body: "California and other residents may opt out of the “sale” or “sharing” of personal data, including for cross-context behavioral advertising.",
      },
      {
        kind: "group",
        heading: "D. Limit Use of Sensitive Data",
        body: "California residents can limit the use of sensitive personal information to only what’s necessary for core services.",
      },
      {
        kind: "p",
        body: (
          <>
            Submit all requests via email at{" "}
            <LegalLink href={`mailto:${SITE.email}`}>{SITE.email}</LegalLink>. We will respond
            within the timeframe required by law (e.g., 45 days under CCPA, 60
            days under Florida law).
          </>
        ),
      },
      {
        kind: "p",
        body: (
          <>
            For SMS-related opt-outs, see{" "}
            <LegalLink href="/sms-terms">SMS Terms</LegalLink>.
          </>
        ),
      },
    ],
  },
  {
    title: "Data Retention & Security",
    blocks: [
      {
        kind: "p",
        body: "We retain personal information only as long as needed for the purposes described above or to comply with legal obligations (typically up to 5 years).",
      },
      {
        kind: "p",
        body: "We implement appropriate security measures to protect data, including:",
      },
      {
        kind: "list",
        items: [
          "SSL encryption",
          "Access control protocols",
          "Regular security audits",
        ],
      },
      {
        kind: "p",
        body: "We may retain and use de-identified or aggregated data for analytical and reporting purposes.",
      },
    ],
  },
  {
    title: "SMS Communications",
    blocks: [
      {
        kind: "p",
        body: (
          <>
            By providing your mobile number, you consent to receiving
            transactional and promotional SMS messages, per our{" "}
            <LegalLink href="/sms-terms">SMS Terms</LegalLink>. You
            may opt out at any time by replying “STOP.” For details on message
            frequency, carrier disclaimers, and consent rules, see Section 1.3
            of our <LegalLink href="/terms">Terms of Use</LegalLink>.
          </>
        ),
      },
    ],
  },
  {
    title: "Children’s Privacy (COPPA Compliance)",
    blocks: [
      {
        kind: "p",
        body: "We do not knowingly collect or solicit personal data from children under 13 years of age. If you believe we have collected such information in violation of the Children’s Online Privacy Protection Act (COPPA), please contact us immediately to have the data deleted.",
      },
      {
        kind: "p",
        body: "If we become aware that a child has submitted personal information without verifiable parental consent, we will promptly delete the information.",
      },
    ],
  },
  {
    title: "Additional Rights for California Residents (CCPA/CPRA)",
    blocks: [
      {
        kind: "p",
        body: "If you are a California resident, you have the right to:",
      },
      {
        kind: "list",
        items: [
          "Know what personal information we collect, use, disclose, and sell/share",
          "Request deletion or correction of your personal information",
          "Opt out of sales or sharing of your personal data",
          "Limit use of sensitive personal information",
          "Designate an authorized agent to exercise these rights on your behalf",
        ],
      },
      {
        kind: "p",
        body: "We do not discriminate against users who exercise their privacy rights.",
      },
      {
        kind: "p",
        body: (
          <>
            You may make such requests by emailing{" "}
            <LegalLink href={`mailto:${SITE.email}`}>{SITE.email}</LegalLink> or calling{" "}
            <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink>.
          </>
        ),
      },
    ],
  },
  {
    title: "Changes to This Policy",
    blocks: [
      {
        kind: "p",
        body: "We may update this Privacy Policy periodically to reflect changes in law, technology, or our business practices. Updates will be posted on our website with a new effective date. We encourage you to review this policy regularly.",
      },
    ],
  },
  {
    title: "Contact Us",
    blocks: [
      {
        kind: "p",
        body: (
          <>
            Prolicense Education LLC
            <br />
            919 NE 24th Ave
            <br />
            Hallandale Beach, FL 33009
            <br />
            Email: <LegalLink href={`mailto:${SITE.email}`}>{SITE.email}</LegalLink>
            <br />
            Phone: <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink>
            <br />
            Website: <LegalLink href="https://www.flcaa.com">https://www.flcaa.com</LegalLink>
          </>
        ),
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Prolicense Education LLC collects, uses, discloses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      breadcrumb="Privacy"
      title={PAGE.title}
      effective={PAGE.effective}
      sections={SECTIONS}
    />
  );
}
