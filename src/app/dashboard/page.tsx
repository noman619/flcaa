import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CircleAlert,
  PlayCircle,
  TriangleAlert,
} from "lucide-react";
import { requireUser, displayName } from "@/lib/auth";
import { getMyEnrollments } from "@/lib/enrollments";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { trackTheme } from "@/lib/catalog";
import { cn, daysUntil, formatShortDate } from "@/lib/utils";
import { ExtensionApplier } from "./extension-applier";

export const metadata: Metadata = {
  title: "My courses",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, user] = await Promise.all([searchParams, requireUser()]);
  const enrollments = await getMyEnrollments(user.id);

  const extensions = enrollments.filter(
    (e) => e.course?.offering_type === "course_extension" && !e.completed_at,
  );
  const courses = enrollments.filter(
    (e) => e.course?.offering_type !== "course_extension",
  );

  const inProgress = courses.filter((e) => e.percent > 0 && e.percent < 100);
  const notStarted = courses.filter((e) => e.percent === 0);
  const finished = courses.filter((e) => e.percent === 100);
  const expiringSoon = courses.filter((e) => {
    const days = daysUntil(e.access_expires_at);
    return days !== null && days > 0 && days <= 30;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl">
            Welcome back, {displayName(user).split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {courses.length === 0
              ? "You have no active enrollments yet."
              : `${courses.length} course${courses.length === 1 ? "" : "s"} on your account · ${finished.length} completed`}
          </p>
        </div>
        <ButtonLink href="/courses" variant="outline">
          Browse more courses
          <ArrowRight aria-hidden />
        </ButtonLink>
      </header>

      {error === "forbidden" ? (
        <Alert tone="error" title="Admins only">
          That area is restricted to staff accounts.
        </Alert>
      ) : null}

      {expiringSoon.length ? (
        <Alert tone="warning" title="Access expiring soon">
          {expiringSoon.map((e) => (
            <p key={e.id}>
              <strong>{e.course?.title}</strong> expires{" "}
              {formatShortDate(e.access_expires_at)} ({daysUntil(e.access_expires_at)}{" "}
              days).{" "}
              <Link
                href={`/courses/${e.course?.track?.slug === "cam" ? "cam-course-extension" : "re-course-extension"}`}
                className="font-medium underline"
              >
                Buy an extension
              </Link>
            </p>
          ))}
        </Alert>
      ) : null}

      {extensions.length ? (
        <ExtensionApplier
          extensions={extensions.map((e) => ({
            id: e.id,
            title: e.course?.title ?? "Course Extension",
            days: e.course?.access_days ?? 90,
          }))}
          targets={courses.map((e) => ({
            id: e.id,
            title: e.course?.title ?? "Course",
            expiresAt: e.access_expires_at,
          }))}
        />
      ) : null}

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Once you enrol, every course you own shows up here with its own progress bar, exam prep and certificate."
          action={
            <ButtonLink href="/courses">
              Browse the catalog <ArrowRight aria-hidden />
            </ButtonLink>
          }
        />
      ) : (
        <div className="space-y-10">
          {inProgress.length ? (
            <CourseGroup title="Continue where you left off" items={inProgress} />
          ) : null}
          {notStarted.length ? (
            <CourseGroup title="Not started" items={notStarted} />
          ) : null}
          {finished.length ? (
            <CourseGroup title="Completed" items={finished} />
          ) : null}
        </div>
      )}
    </div>
  );
}

function CourseGroup({
  title,
  items,
}: {
  title: string;
  items: Awaited<ReturnType<typeof getMyEnrollments>>;
}) {
  return (
    <section>
      <h2 className="mb-4 font-display text-lg">{title}</h2>
      <ul className="grid gap-4 lg:grid-cols-2">
        {items.map((enrollment) => {
          const course = enrollment.course;
          const theme = trackTheme(course?.track?.slug ?? "real-estate");
          const days = daysUntil(enrollment.access_expires_at);

          return (
            <li
              key={enrollment.id}
              className="group relative flex flex-col overflow-hidden rounded-card border border-ink-200 bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="h-1" style={{ backgroundColor: theme.accent }} />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" size="sm">
                    {course?.track?.name ?? "Course"}
                  </Badge>
                  {enrollment.certificate_number ? (
                    <Badge variant="success" size="sm">
                      <Award aria-hidden /> Certified
                    </Badge>
                  ) : null}
                  {enrollment.isExpired ? (
                    <Badge variant="danger" size="sm">
                      <TriangleAlert aria-hidden /> Access expired
                    </Badge>
                  ) : null}
                </div>

                <h3 className="font-display text-lg leading-snug">
                  <Link
                    href={`/dashboard/courses/${enrollment.course_id}`}
                    className="before:absolute before:inset-0 before:content-['']"
                  >
                    {course?.title ?? "Course"}
                  </Link>
                </h3>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-ink-700">
                      {enrollment.completedLessons} of {enrollment.totalLessons}{" "}
                      lessons
                    </span>
                    <span className="font-medium text-ink-900">
                      {enrollment.percent}%
                    </span>
                  </div>
                  <Progress
                    value={enrollment.percent}
                    label={`${course?.title} progress`}
                    barClassName={
                      enrollment.percent === 100 ? "bg-emerald-600" : undefined
                    }
                  />
                </div>

                <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5" aria-hidden />
                    <dt className="sr-only">Access expires</dt>
                    <dd
                      className={cn(
                        days !== null && days <= 30 && days > 0 && "text-amber-700",
                        enrollment.isExpired && "text-red-600",
                      )}
                    >
                      {enrollment.isExpired
                        ? "Expired"
                        : `Access until ${formatShortDate(enrollment.access_expires_at)}`}
                    </dd>
                  </div>
                  {enrollment.bestScore !== null ? (
                    <div className="flex items-center gap-1.5">
                      <CircleAlert className="size-3.5" aria-hidden />
                      <dt className="sr-only">Best exam score</dt>
                      <dd
                        className={
                          enrollment.hasPassed ? "text-emerald-700" : "text-ink-500"
                        }
                      >
                        Best exam {enrollment.bestScore}%
                        {enrollment.hasPassed ? " · passed" : ""}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <span className="relative z-10 mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand-700 transition-transform group-hover:translate-x-0.5">
                  <PlayCircle className="size-4" aria-hidden />
                  {enrollment.percent === 0
                    ? "Start course"
                    : enrollment.percent === 100
                      ? "Review course"
                      : "Continue"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
