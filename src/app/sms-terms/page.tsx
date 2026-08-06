import type { Metadata } from "next";
import {
  LegalDocument,
  LegalLink,
  type LegalSection,
} from "@/components/marketing/legal-document";
import { SITE } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/sms-terms                  */
/* -------------------------------------------------------------------------- */

const PAGE = {
  title: "Prolicense Education LLC - SMS Terms and Conditions",
  effective: "Effective Date: January 01, 2026",
  lead: "Prolicense Education LLC (\"Prolicense,\" \"we,\" \"us,\" or \"our\"). By opting into our SMS program, you agree to the following Terms and Conditions. Our SMS program includes marketing messages and notifications related to your course progress.",
} as const;

/**
 * The original's support address on this page is support@flcaa.com, while the
 * rest of the site publishes info@flcaa.com. Ported as written rather than
 * reconciled — an SMS programme's contact of record is a compliance detail.
 */
const SMS_SUPPORT_EMAIL = "support@flcaa.com";

const SECTIONS: readonly LegalSection[] = [
  {
    title: "Consent",
    blocks: [
      {
        kind: "group",
        heading: "Express Written Consent",
        body: "You must provide prior express written consent to receive SMS messages from Prolicense. This applies to all messages, including marketing and transactional notifications.",
      },
      {
        kind: "group",
        heading: "Consent Acquisition Methods",
        body: "Consent may be provided through:",
        items: [
          <>
            Online forms on <LegalLink href="/">flcaa.com</LegalLink>
          </>,
          "Website opt-ins",
          "Verbal agreements (recorded for quality assurance)",
          "Texting a specified keyword to our number",
        ],
      },
      {
        kind: "group",
        heading: "Double Opt-In (Recommended)",
        body: "After your initial opt-in, we may send a confirmation message to verify your consent. You must reply as instructed to confirm subscription.",
      },
    ],
  },
  {
    title: "Message Frequency and Content",
    blocks: [
      {
        kind: "group",
        heading: "Types of Messages",
        body: "You will receive:",
        items: [
          "Marketing/promotional messages about our courses, discounts, or events",
          "Transactional notifications related to course progress, reminders, and account updates",
        ],
      },
      {
        kind: "group",
        heading: "Frequency",
        body: "You may receive up to 4 messages per week. Frequency may vary based on your interactions.",
      },
      {
        kind: "group",
        heading: "Program Description",
        body: "Our SMS program is designed to keep you informed about your enrollment, course progress, special offers, and important updates.",
      },
    ],
  },
  {
    title: "Opt-Out Mechanism",
    blocks: [
      {
        kind: "group",
        heading: "Easy Opt-Out",
        body: (
          <>
            To stop receiving messages, text “STOP” to{" "}
            <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink> at any
            time.
          </>
        ),
      },
      {
        kind: "group",
        heading: "Confirmation of Opt-Out",
        body: "You will receive a confirmation text confirming your removal from our SMS list.",
      },
      {
        kind: "group",
        heading: "Immediate Processing",
        body: "Your opt-out request will be honored immediately without delay.",
      },
    ],
  },
  {
    title: "Privacy Policy and Data Handling",
    blocks: [
      {
        kind: "group",
        heading: "Privacy Policy Link",
        body: (
          <>
            Review our full{" "}
            <LegalLink href="/privacy">Privacy Policy</LegalLink>
          </>
        ),
      },
      {
        kind: "group",
        heading: "Data Usage",
        body: "Your information will be used to provide SMS services and may be shared with trusted third parties for service delivery only.",
      },
      {
        kind: "group",
        heading: "Data Security",
        body: "We use industry-standard practices to safeguard your data from unauthorized access or disclosure.",
      },
    ],
  },
  {
    title: "Fees and Costs",
    blocks: [
      {
        kind: "group",
        heading: "Message and Data Rates",
        body: "Message and data rates may apply per your mobile carrier’s plan.",
      },
      {
        kind: "group",
        heading: "No Additional Fees",
        body: "Prolicense does not charge additional fees for receiving SMS messages.",
      },
    ],
  },
  {
    title: "Customer Support",
    blocks: [
      {
        kind: "group",
        heading: "Help Information",
        body: (
          <>
            For assistance, text “HELP” to{" "}
            <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink>.
          </>
        ),
      },
      {
        kind: "group",
        heading: "Contact Info",
        items: [
          <>
            Phone: <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink>
          </>,
          <>
            Email:{" "}
            <LegalLink href={`mailto:${SMS_SUPPORT_EMAIL}`}>
              {SMS_SUPPORT_EMAIL}
            </LegalLink>
          </>,
          <>
            Website: <LegalLink href="/">https://flcaa.com</LegalLink>
          </>,
        ],
      },
    ],
  },
  {
    title: "Compliance",
    blocks: [
      {
        kind: "group",
        heading: "TCPA Compliance",
        body: "Our SMS program is fully compliant with the Telephone Consumer Protection Act (TCPA), including rules around consent, opt-outs, and restricted hours.",
      },
      {
        kind: "group",
        heading: "State Laws",
        body: "We comply with applicable state-specific SMS regulations within the United States.",
      },
      {
        kind: "group",
        heading: "CTIA Guidelines",
        body: "Our SMS practices align with CTIA standards, including confirmation messages and compliant opt-in language.",
      },
    ],
  },
  {
    title: "Territory",
    blocks: [
      {
        kind: "group",
        heading: "U.S. Only",
        body: "Our SMS messages are intended for recipients within the United States only.",
      },
    ],
  },
  {
    title: "Company Information",
    blocks: [
      {
        kind: "p",
        body: (
          <>
            Prolicense Education LLC
            <br />
            919 NE 24th Avenue
            <br />
            Hallandale Beach, FL 33009
            <br />
            Phone: <LegalLink href={SITE.phoneHref}>{SITE.phone}</LegalLink>
            <br />
            Website: <LegalLink href="/">https://flcaa.com</LegalLink>
          </>
        ),
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "SMS Terms and Conditions",
  description:
    "Consent, message frequency, opt-out and compliance terms for the Prolicense Florida SMS program.",
  alternates: { canonical: "/sms-terms" },
};

export default function SmsTermsPage() {
  return (
    <LegalDocument
      breadcrumb="SMS Terms"
      title={PAGE.title}
      effective={PAGE.effective}
      lead={PAGE.lead}
      sections={SECTIONS}
    />
  );
}
