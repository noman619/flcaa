import { SITE } from "@/lib/site";

/**
 * FAQ content is derived from the course's own business rules so the answers
 * stay accurate when pricing/hours/passing scores change in Supabase.
 */
export function CourseFaq({
  courseTitle,
  hours,
  accessDays,
  passingScore,
  isExtension,
}: {
  courseTitle: string;
  hours: string | null;
  accessDays: number;
  passingScore: number;
  isExtension: boolean;
}) {
  const faqs = isExtension
    ? [
        {
          q: "What does a course extension do?",
          a: `An extension pushes back the access expiry date on a course you already own. After checkout, open your dashboard and choose which enrollment to apply it to — the new expiry date is set immediately.`,
        },
        {
          q: "Do I lose my progress when my access expires?",
          a: "No. Your completed lessons, exam attempts and certificates stay on your account. An extension simply re-opens the course content.",
        },
        {
          q: "Can I buy more than one extension?",
          a: "Yes. Each extension you purchase adds another access window on top of whatever time is left.",
        },
      ]
    : [
        {
          q: "Is this course approved by the State of Florida?",
          a: "Yes. It is approved by the Florida Department of Business & Professional Regulation (DBPR), and your completion is reported to the state electronically.",
        },
        {
          q: hours
            ? `Do I have to finish all ${hours} in one sitting?`
            : "Do I have to finish in one sitting?",
          a: `No. The course is entirely self-paced. Start and stop as often as you like — your progress is saved automatically and you can resume on any device. You have ${accessDays} days of access from the day you enrol.`,
        },
        {
          q: "What score do I need to pass?",
          a: `You need ${passingScore}% or higher on the final exam. Attempts are unlimited, each one is scored instantly, and you get an explanation for every question you miss.`,
        },
        {
          q: "When do I get my certificate?",
          a: `Immediately. Once you complete every lesson and pass the exam, ${courseTitle} issues a certificate with a unique certificate number straight to your dashboard.`,
        },
        {
          q: "Can I talk to a real instructor?",
          a: "Yes. Every enrollment includes direct messaging with a licensed Florida instructor from inside the course player. Most questions are answered within one business day.",
        },
        {
          q: "What if I change my mind?",
          a: `Request a refund within 7 days of purchase, as long as you have completed less than 25% of the course. See our returns policy for the full terms, or call ${SITE.phone}.`,
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-display text-2xl">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-ink-200 overflow-hidden rounded-card border border-ink-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-ink-900 transition-colors hover:bg-ink-50">
              {faq.q}
              <span
                className="shrink-0 text-xl leading-none text-ink-400 transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-ink-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
