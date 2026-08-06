import type { Metadata } from "next";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getMyEnrollments } from "@/lib/enrollments";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certificates",
  robots: { index: false, follow: false },
};

export default async function CertificatesPage() {
  const user = await requireUser();
  const enrollments = await getMyEnrollments(user.id);

  const earned = enrollments.filter(
    (e) => e.certificate_number && e.course?.offering_type !== "course_extension",
  );
  const pending = enrollments.filter(
    (e) =>
      !e.certificate_number &&
      e.course?.offering_type !== "course_extension" &&
      e.totalLessons > 0,
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Certificates</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Certificates are issued automatically once you complete every lesson and
          pass the final exam. They stay on your account permanently.
        </p>
      </header>

      {earned.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Finish a course and pass its exam to earn your first certificate."
          action={
            <ButtonLink href="/dashboard" variant="outline">
              Back to my courses
            </ButtonLink>
          }
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {earned.map((enrollment) => (
            <li
              key={enrollment.id}
              className="rounded-card border border-ink-200 bg-white p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <Award className="size-6 text-accent-500" aria-hidden />
                <Badge variant="success" size="sm">
                  Issued
                </Badge>
              </div>
              <h2 className="mt-4 font-display text-lg leading-snug">
                {enrollment.course?.title}
              </h2>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Certificate no.</dt>
                  <dd className="font-mono text-xs font-medium text-ink-900">
                    {enrollment.certificate_number}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Completed</dt>
                  <dd className="text-ink-900">
                    {formatDate(enrollment.completed_at)}
                  </dd>
                </div>
              </dl>
              <ButtonLink
                href={`/dashboard/certificates/${enrollment.id}`}
                variant="outline"
                size="sm"
                className="mt-5"
                block
              >
                <ExternalLink /> View &amp; print certificate
              </ButtonLink>
            </li>
          ))}
        </ul>
      )}

      {pending.length ? (
        <section>
          <h2 className="mb-3 font-display text-lg">In progress</h2>
          <ul className="divide-y divide-ink-100 overflow-hidden rounded-card border border-ink-200 bg-white">
            {pending.map((enrollment) => (
              <li
                key={enrollment.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/courses/${enrollment.course_id}`}
                    className="text-sm font-medium text-ink-900 hover:underline"
                  >
                    {enrollment.course?.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {enrollment.completedLessons}/{enrollment.totalLessons} lessons ·{" "}
                    {enrollment.hasPassed
                      ? "exam passed"
                      : enrollment.bestScore !== null
                        ? `best exam ${enrollment.bestScore}%`
                        : "exam not attempted"}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink-500">
                  {enrollment.percent}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
