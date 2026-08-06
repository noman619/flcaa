import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser, displayName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatHours } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { PrintButton } from "./print-button";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Certificate",
  robots: { index: false, follow: false },
};

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ enrollmentId: string }>;
}) {
  const [{ enrollmentId }, user] = await Promise.all([params, requireUser()]);

  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select(
      "id, user_id, completed_at, certificate_number, course:courses(title, hours, track:tracks(name))",
    )
    .eq("id", enrollmentId)
    .maybeSingle();

  const enrollment = data as unknown as {
    id: string;
    user_id: string;
    completed_at: string | null;
    certificate_number: string | null;
    course: { title: string; hours: number | null; track: { name: string } | null } | null;
  } | null;

  if (!enrollment || enrollment.user_id !== user.id) notFound();
  if (!enrollment.certificate_number) notFound();

  const hours = formatHours(enrollment.course?.hours);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <ButtonLink href="/dashboard/certificates" variant="ghost" size="sm">
          ← All certificates
        </ButtonLink>
        <PrintButton />
      </div>

      {/* The certificate itself — styled to print cleanly on one page. */}
      <div className="rounded-card border-8 border-double border-accent-300 bg-white p-10 shadow-card print:border-4 print:shadow-none lg:p-16">
        <div className="border-b border-ink-200 pb-8 text-center">
          <p className="text-xs font-medium tracking-[0.28em] text-accent-600 uppercase">
            {SITE.name}
          </p>
          <h1 className="mt-5 font-display text-3xl lg:text-4xl">
            Certificate of Completion
          </h1>
          <p className="mt-3 text-sm text-ink-500">
            Florida DBPR-approved education provider
          </p>
        </div>

        <div className="py-10 text-center">
          <p className="text-sm tracking-wide text-ink-500 uppercase">
            This certifies that
          </p>
          <p className="mt-3 font-display text-3xl text-ink-900 lg:text-4xl">
            {displayName(user)}
          </p>
          <p className="mt-8 text-sm tracking-wide text-ink-500 uppercase">
            has successfully completed
          </p>
          <p className="mx-auto mt-3 max-w-2xl font-display text-2xl leading-snug text-ink-900">
            {enrollment.course?.title}
          </p>
          {hours ? (
            <p className="mt-3 text-sm text-ink-600">
              {hours} · {enrollment.course?.track?.name}
            </p>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-6 border-t border-ink-200 pt-8 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-wider text-ink-500 uppercase">
              Date completed
            </dt>
            <dd className="mt-1 font-medium text-ink-900">
              {formatDate(enrollment.completed_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wider text-ink-500 uppercase">
              Certificate number
            </dt>
            <dd className="mt-1 font-mono text-xs font-medium text-ink-900">
              {enrollment.certificate_number}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs tracking-wider text-ink-500 uppercase">
              Issued by
            </dt>
            <dd className="mt-1 font-medium text-ink-900">{SITE.legalName}</dd>
          </div>
        </dl>

        <p className="mt-8 border-t border-ink-100 pt-6 text-center text-xs leading-relaxed text-ink-400">
          This certificate is verifiable by its certificate number. Course
          completion has been reported electronically to the Florida Department of
          Business &amp; Professional Regulation where required.
        </p>
      </div>
    </div>
  );
}
