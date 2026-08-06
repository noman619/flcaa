"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronLeft,
  Download,
  FileText,
  ListChecks,
  Loader2,
  MessageSquare,
  MonitorPlay,
  PanelLeftClose,
  PanelLeftOpen,
  TriangleAlert,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { trackTheme } from "@/lib/catalog";
import { cn, formatDuration, formatShortDate } from "@/lib/utils";
import { setLessonComplete } from "@/app/dashboard/actions";
import type { LessonKind } from "@/lib/database.types";
import type { ModuleWithLessons } from "@/lib/queries";

const LESSON_ICON: Record<LessonKind, typeof FileText> = {
  video: MonitorPlay,
  text: FileText,
  quiz: ListChecks,
  download: Download,
};

export function CoursePlayer(props: {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  trackSlug: string;
  trackName: string;
  modules: ModuleWithLessons[];
  completedLessonIds: string[];
  activeLessonId: string | null;
  previousLessonId: string | null;
  nextLessonId: string | null;
  percent: number;
  completedCount: number;
  totalLessons: number;
  isExpired: boolean;
  accessExpiresAt: string | null;
  certificateNumber: string | null;
  hasPassed: boolean;
  bestScore: number | null;
  passingScore: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = trackTheme(props.trackSlug);

  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = React.useState(true);

  const completed = React.useMemo(
    () => new Set(props.completedLessonIds),
    [props.completedLessonIds],
  );

  const activeLesson = React.useMemo(
    () =>
      props.modules
        .flatMap((m) => m.lessons)
        .find((l) => l.id === props.activeLessonId) ?? null,
    [props.modules, props.activeLessonId],
  );

  function goToLesson(lessonId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lesson", lessonId);
    router.push(`/dashboard/courses/${props.courseId}?${params.toString()}`, {
      scroll: true,
    });
  }

  async function toggleComplete(markComplete: boolean) {
    if (!activeLesson) return;
    setPending(true);
    setError(null);

    const res = await setLessonComplete(
      props.enrollmentId,
      activeLesson.id,
      markComplete,
    );

    setPending(false);
    if (res.error) {
      setError(res.error);
      return;
    }

    if (markComplete && autoAdvance && props.nextLessonId) {
      goToLesson(props.nextLessonId);
    } else {
      router.refresh();
    }
  }

  const isComplete = activeLesson ? completed.has(activeLesson.id) : false;
  const allDone = props.totalLessons > 0 && props.completedCount === props.totalLessons;

  return (
    <div className="-my-8 lg:-my-12">
      {/* --------------------------- player header -------------------------- */}
      <header className="border-b border-ink-200 bg-white">
        <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Hide course outline" : "Show course outline"}
            className="hidden lg:inline-flex"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-5" />
            ) : (
              <PanelLeftOpen className="size-5" />
            )}
          </Button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ChevronLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base">
              {props.courseTitle}
            </h1>
            <p className="truncate text-xs text-ink-500">
              {props.trackName} · {props.completedCount}/{props.totalLessons} lessons
              complete
            </p>
          </div>

          <div className="hidden w-44 shrink-0 md:block">
            <Progress
              value={props.percent}
              label="Course progress"
              barClassName={allDone ? "bg-emerald-600" : undefined}
            />
            <p className="mt-1 text-right text-xs font-medium text-ink-600">
              {props.percent}%
            </p>
          </div>

          <ButtonLink
            href={`/dashboard/courses/${props.courseId}/exam`}
            size="sm"
            variant="outline"
            className="shrink-0"
          >
            <ListChecks />
            <span className="hidden sm:inline">Exam prep</span>
          </ButtonLink>
        </div>
      </header>

      <div className="flex min-h-[70vh]">
        {/* ----------------------------- sidebar ---------------------------- */}
        <aside
          className={cn(
            "shrink-0 overflow-y-auto border-r border-ink-200 bg-white transition-all duration-200",
            sidebarOpen ? "w-full max-w-sm lg:w-80" : "hidden",
            "hidden lg:block",
          )}
        >
          <nav aria-label="Course outline" className="p-3">
            {props.modules.map((module, moduleIndex) => {
              const moduleDone = module.lessons.every((l) => completed.has(l.id));
              return (
                <section key={module.id} className="mb-4">
                  <h2 className="mb-1.5 flex items-center gap-2 px-2.5 text-xs font-medium tracking-wide text-ink-500 uppercase">
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded text-[10px] font-medium text-white",
                      )}
                      style={{
                        backgroundColor: moduleDone ? "#059669" : theme.accent,
                      }}
                    >
                      {moduleDone ? <Check className="size-3" /> : moduleIndex + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate normal-case">
                      {module.title}
                    </span>
                  </h2>
                  <ul>
                    {module.lessons.map((lesson) => {
                      const Icon = LESSON_ICON[lesson.kind] ?? FileText;
                      const done = completed.has(lesson.id);
                      const active = lesson.id === props.activeLessonId;
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => goToLesson(lesson.id)}
                            aria-current={active ? "true" : undefined}
                            className={cn(
                              "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                              active
                                ? "bg-brand-50 font-medium text-brand-900"
                                : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                            )}
                          >
                            {done ? (
                              <CheckCircle2
                                className="mt-0.5 size-4 shrink-0 text-emerald-600"
                                aria-hidden
                              />
                            ) : (
                              <Icon
                                className="mt-0.5 size-4 shrink-0 text-ink-400"
                                aria-hidden
                              />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block leading-snug">
                                {lesson.title}
                              </span>
                              <span className="mt-0.5 block text-xs text-ink-400">
                                {formatDuration(lesson.duration_minutes)}
                                {done ? " · complete" : ""}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </nav>
        </aside>

        {/* ------------------------------ content --------------------------- */}
        <div className="min-w-0 flex-1 bg-white">
          <div className="mx-auto max-w-3xl px-5 py-8 lg:px-10 lg:py-12">
            {props.isExpired ? (
              <Alert tone="error" title="Your access has expired" className="mb-8">
                Access ended {formatShortDate(props.accessExpiresAt)}. Purchase a
                course extension to reopen the material — your progress is saved.
                <div className="mt-3">
                  <ButtonLink
                    href={`/courses/${props.trackSlug === "cam" ? "cam-course-extension" : "re-course-extension"}`}
                    size="sm"
                  >
                    Buy an extension
                  </ButtonLink>
                </div>
              </Alert>
            ) : null}

            {error ? (
              <Alert tone="error" className="mb-6">
                {error}
              </Alert>
            ) : null}

            {props.certificateNumber ? (
              <Alert tone="success" title="Course complete" className="mb-8">
                Certificate <strong>{props.certificateNumber}</strong> has been
                issued.{" "}
                <Link
                  href={`/dashboard/certificates/${props.enrollmentId}`}
                  className="font-medium underline"
                >
                  View and print it
                </Link>
                .
              </Alert>
            ) : allDone && !props.hasPassed ? (
              <Alert tone="info" title="One step left" className="mb-8">
                All lessons are done. Pass the final exam with{" "}
                {props.passingScore}% or higher to unlock your certificate.
                <div className="mt-3">
                  <ButtonLink
                    href={`/dashboard/courses/${props.courseId}/exam`}
                    size="sm"
                  >
                    Take the exam
                  </ButtonLink>
                </div>
              </Alert>
            ) : null}

            {!activeLesson ? (
              <div className="rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-16 text-center">
                <TriangleAlert
                  className="mx-auto mb-3 size-6 text-ink-400"
                  aria-hidden
                />
                <p className="font-display text-lg">
                  No lessons published yet
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">
                  Course content is being loaded for this enrollment. Exam prep is
                  available in the meantime.
                </p>
              </div>
            ) : (
              <article>
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" size="sm">
                    {activeLesson.kind === "video"
                      ? "Video lesson"
                      : activeLesson.kind === "quiz"
                        ? "Quiz"
                        : activeLesson.kind === "download"
                          ? "Download"
                          : "Reading"}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {formatDuration(activeLesson.duration_minutes)}
                  </Badge>
                  {isComplete ? (
                    <Badge variant="success" size="sm">
                      <Check aria-hidden /> Complete
                    </Badge>
                  ) : null}
                </div>

                <h2 className="font-display text-2xl lg:text-3xl">
                  {activeLesson.title}
                </h2>

                <LessonBody
                  kind={activeLesson.kind}
                  content={activeLesson.content}
                  title={activeLesson.title}
                />

                {/* ------------------------- lesson footer ------------------- */}
                <div className="mt-12 border-t border-ink-200 pt-6">
                  <label className="mb-5 flex items-center gap-2.5 text-sm text-ink-600">
                    <input
                      type="checkbox"
                      checked={autoAdvance}
                      onChange={(e) => setAutoAdvance(e.target.checked)}
                      className="size-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
                    />
                    Automatically go to the next lesson when I mark this complete
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      onClick={() => toggleComplete(!isComplete)}
                      disabled={pending || props.isExpired}
                      variant={isComplete ? "outline" : "primary"}
                      size="lg"
                      className="sm:flex-1"
                    >
                      {pending ? <Loader2 className="animate-spin" /> : <Check />}
                      {isComplete ? "Mark as not complete" : "Mark lesson complete"}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        disabled={!props.previousLessonId}
                        onClick={() =>
                          props.previousLessonId && goToLesson(props.previousLessonId)
                        }
                      >
                        <ArrowLeft /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        disabled={!props.nextLessonId}
                        onClick={() =>
                          props.nextLessonId && goToLesson(props.nextLessonId)
                        }
                      >
                        Next <ArrowRight />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* ---------------------------- helpers ---------------------- */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Link
                href="/dashboard/messages"
                className="flex items-start gap-3 rounded-card border border-ink-200 p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
              >
                <MessageSquare className="mt-0.5 size-5 text-brand-600" aria-hidden />
                <span>
                  <span className="block font-medium text-ink-900">
                    Ask your instructor
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-500">
                    Stuck on this lesson? Send a question and get a reply within one
                    business day.
                  </span>
                </span>
              </Link>
              <Link
                href={`/dashboard/courses/${props.courseId}/exam`}
                className="flex items-start gap-3 rounded-card border border-ink-200 p-5 transition-colors hover:border-accent-300 hover:bg-accent-50/50"
              >
                <Award className="mt-0.5 size-5 text-accent-600" aria-hidden />
                <span>
                  <span className="block font-medium text-ink-900">
                    Practice exam & flashcards
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-500">
                    {props.bestScore !== null
                      ? `Best score ${props.bestScore}% · need ${props.passingScore}% to pass`
                      : `Unlimited scored attempts · need ${props.passingScore}% to pass`}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------ mobile lesson picker ---------------------- */}
      <div className="border-t border-ink-200 bg-white p-4 lg:hidden">
        <label
          htmlFor="mobile-lesson"
          className="mb-1.5 block text-xs font-medium tracking-wider text-ink-500 uppercase"
        >
          Jump to lesson
        </label>
        <select
          id="mobile-lesson"
          value={props.activeLessonId ?? ""}
          onChange={(e) => goToLesson(e.target.value)}
          className="h-11 w-full rounded-lg border border-ink-300 bg-white px-3 text-sm"
        >
          {props.modules.map((module) => (
            <optgroup key={module.id} label={module.title}>
              {module.lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {completed.has(lesson.id) ? "✓ " : ""}
                  {lesson.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}

function LessonBody({
  kind,
  content,
  title,
}: {
  kind: LessonKind;
  content: string | null;
  title: string;
}) {
  if (kind === "video") {
    const url = content?.trim();
    const embed = url ? toEmbedUrl(url) : null;
    return (
      <div className="mt-6">
        {embed ? (
          <div className="aspect-video w-full overflow-hidden rounded-card bg-ink-950">
            <iframe
              src={embed}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-card border border-dashed border-ink-300 bg-ink-50 text-center">
            <MonitorPlay className="mb-3 size-8 text-ink-400" aria-hidden />
            <p className="font-medium text-ink-700">Video coming soon</p>
            <p className="mt-1 max-w-xs text-sm text-ink-500">
              No video URL is attached to this lesson yet. Read the module notes
              and continue.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (kind === "download") {
    return (
      <div className="mt-6 flex items-center justify-between gap-4 rounded-card border border-ink-200 bg-ink-50 p-5">
        <div>
          <p className="font-medium text-ink-900">{title}</p>
          <p className="mt-0.5 text-sm text-ink-500">
            Downloadable resource for this module.
          </p>
        </div>
        {content ? (
          <a
            href={content}
            download
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-medium text-white hover:bg-brand-800"
          >
            <Download className="size-4" aria-hidden />
            Download
          </a>
        ) : (
          <span className="text-sm text-ink-400">Not available yet</span>
        )}
      </div>
    );
  }

  if (!content) {
    return (
      <p className="mt-6 rounded-card border border-dashed border-ink-300 bg-ink-50 p-6 text-sm text-ink-500">
        Lesson notes for this section are being finalised. Mark it complete once
        you have reviewed the material with your instructor.
      </p>
    );
  }

  return (
    <div className="prose-flca mt-6 max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

/** Turns common video URLs into their embeddable form. */
function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      return `https://player.vimeo.com/video${parsed.pathname}`;
    }
    return url;
  } catch {
    return null;
  }
}
