import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Infinity as InfinityIcon,
  ListChecks,
  MessageSquare,
  MonitorPlay,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/stars";
import { ButtonLink } from "@/components/ui/button";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CourseCard } from "@/components/course/course-card";
import { SectionHeading } from "@/components/marketing/section";
import { OFFERING_TYPES, trackTheme } from "@/lib/catalog";
import {
  averageRating,
  courseTotals,
  getCourseBySlug,
  getCourseSlugs,
  getCoursesByTrack,
  getPublishedReviews,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { getOwnedCourseIds } from "@/lib/enrollments";
import { cn, formatDuration, formatHours, formatPrice } from "@/lib/utils";
import { SITE, trackLabel } from "@/lib/site";
import { CourseFaq } from "@/components/course/course-faq";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { COURSE_FAQS } from "@/content/course-faqs";
import { GoogleReviewsBand } from "@/components/marketing/google-reviews-source";
import { VideoPlayer } from "@/components/ui/video-player";
import {
  COURSE_EXAM_CHART,
  COURSE_FEATURES,
  COURSE_HIGHLIGHTS,
  COURSE_STATS,
  COURSE_VIDEOS,
} from "@/lib/course-media";
import { SinglePlanPricing } from "@/components/course/single-plan-pricing";
import {
  ExamChart,
  InstructorsBand,
  RelatedResources,
  StatsBand,
} from "@/components/course/course-sections";
import { PROMO, promoDiscountCents } from "@/lib/promo";
import type { LessonKind } from "@/lib/database.types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };

  const hours = formatHours(course.hours);
  const description =
    course.subtitle ??
    course.description?.slice(0, 155) ??
    `${course.title} — Florida-approved, self-paced online course.`;

  return {
    title: hours ? `${course.title} (${hours})` : course.title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      type: "article",
      title: course.title,
      description,
      url: `/courses/${course.slug}`,
    },
  };
}

const LESSON_ICON: Record<LessonKind, typeof FileText> = {
  video: MonitorPlay,
  text: FileText,
  quiz: ListChecks,
  download: Download,
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course || !course.is_published) notFound();

  const [reviews, user, related] = await Promise.all([
    getPublishedReviews({ courseId: course.id }),
    getCurrentUser(),
    getCoursesByTrack(course.track?.slug ?? ""),
  ]);

  const owned = user ? (await getOwnedCourseIds(user.id)).has(course.id) : false;
  const theme = trackTheme(course.track?.slug ?? "real-estate");
  const totals = courseTotals(course.modules);
  const hours = formatHours(course.hours);
  const rating = averageRating(reviews);
  const meta = OFFERING_TYPES[course.offering_type];
  const isExtension = course.offering_type === "course_extension";

  // Same promotion the cart and checkout apply, so the advertised price and
  // the price on this page cannot disagree.
  const promoDiscount = promoDiscountCents([
    { slug: course.slug, unitPriceCents: course.price_cents },
  ]);
  const payableCents = course.price_cents - promoDiscount;
  // Narrowing from the notFound() guard does not reach the nested component.
  const detail = course;
  const video = COURSE_VIDEOS[course.slug];
  const highlights = COURSE_HIGHLIGHTS[course.slug];
  const features = COURSE_FEATURES[course.slug];
  const stats = COURSE_STATS[course.slug];
  const examChart = COURSE_EXAM_CHART[course.slug];
  // A bespoke FAQ replaces the generated one rather than adding a second.
  const faqs = COURSE_FAQS[course.slug];
  // Courses with marketing highlights lead with the full description; it is
  // then skipped in the overview section so it is not printed twice.
  const heroIntro = highlights ? course.description : null;

  const included = [
    {
      icon: MonitorPlay,
      label: "Self-paced online delivery",
      detail: "Study on desktop, tablet or phone — progress syncs automatically.",
    },
    {
      icon: CalendarClock,
      label: `${course.access_days ?? 365} days of access`,
      detail: "Extendable at any time if you need longer.",
    },
    {
      icon: MessageSquare,
      label: "Direct instructor messaging",
      detail: "Ask a licensed Florida instructor a question from inside the course.",
    },
    {
      icon: Trophy,
      label: "Certificate of completion",
      detail: `Issued automatically once you finish and score ${course.passing_exam_score ?? 70}% or higher.`,
    },
    {
      icon: ListChecks,
      label: "Practice exam & flashcards",
      detail: "Unlimited scored attempts with answer explanations.",
    },
    {
      icon: InfinityIcon,
      label: "Records kept forever",
      detail: "Your certificates and attempt history stay in your account.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle ?? course.description ?? undefined,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      sameAs: process.env.NEXT_PUBLIC_SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: (payableCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: meta?.label,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.hours ? `PT${course.hours}H` : undefined,
    },
    ...(rating && reviews.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  /** The price + add-to-cart panel, as an element rather than a nested
   *  component — declaring a component inside render remounts it every pass.
   * Rendered in the hero for plain catalog
   *  courses, or as its own section under the hero for courses that lead
   *  with a marketing video — matching how those are laid out on the
   *  original site, where pricing is the second section. */
  const purchaseCard = (
    <div className="rounded-panel border border-ink-200/70 bg-white p-7 shadow-pop">
      {promoDiscount > 0 ? (
        <p className="mb-1 text-sm text-ink-400 line-through">
          {formatPrice(detail.price_cents)}
        </p>
      ) : null}
      <p className="tabular font-display text-[2.5rem] leading-none text-ink-900">
        {payableCents === 0 ? "Free" : formatPrice(payableCents)}
      </p>
      {promoDiscount > 0 ? (
        <p className="mt-1 text-xs font-medium text-accent-600">
          {PROMO.label}
        </p>
      ) : null}
      <p className="mt-1 text-sm text-ink-500">
        One-time payment · No subscription
      </p>

      <div className="mt-5">
        <AddToCartButton
          owned={owned}
          item={{
            courseId: detail.id,
            slug: detail.slug,
            title: detail.title,
            priceCents: detail.price_cents,
            trackSlug: detail.track?.slug ?? "real-estate",
            hours: detail.hours,
          }}
        />
      </div>

      <ul className="mt-6 space-y-3 border-t border-ink-100 pt-5 text-sm">
        {[
          `${detail.access_days ?? 365} days of course access`,
          "Instructor messaging included",
          "Certificate on completion",
          "7-day refund window",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-ink-600">
            <BadgeCheck
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-ink-100 pt-4 text-xs leading-relaxed text-ink-400">
        Questions before you buy?{" "}
        <Link href="/contact" className="text-brand-600 underline">
          Talk to an advisor
        </Link>{" "}
        or call {SITE.phone}.
      </p>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data for rich results.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ------------------------------- hero ------------------------------- */}
      <section className={cn("border-b", theme.border, theme.bg)}>
        <div className="container-page py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
              <li>
                <Link href="/" className="hover:text-ink-900 hover:underline">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden />
              <li>
                <Link
                  href={`/${course.track?.slug}`}
                  className="hover:text-ink-900 hover:underline"
                >
                  {trackLabel(course.track?.slug)}
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden />
              <li className="font-medium text-ink-900" aria-current="page">
                {course.title}
              </li>
            </ol>
          </nav>

          {/*
            A video needs room, so it gets the larger column. The purchase card
            does not — it is a fixed-width panel, and stretching it just pads
            the price, so plain catalog courses keep the text-heavy split.
          */}
          <div
            className={cn(
              "grid gap-10 lg:gap-14",
              video
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center"
                : "lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]",
            )}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className="text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  {meta?.label}
                </Badge>
                {course.is_state_approved ? (
                  <Badge variant="success">
                    <ShieldCheck aria-hidden /> Florida DBPR approved
                  </Badge>
                ) : null}
                {owned ? <Badge variant="brand">You own this</Badge> : null}
              </div>

              <h1 className="mt-5 max-w-3xl font-display text-3xl leading-tight lg:text-[2.75rem]">
                {course.title}
              </h1>

              {heroIntro ? (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
                  {heroIntro}
                </p>
              ) : course.subtitle ? (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
                  {course.subtitle}
                </p>
              ) : null}

              {highlights ? (
                <ul className="mt-7 space-y-4">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3.5">
                      <span className="icon-tile mt-0.5 size-7">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      <span className="text-[15px] leading-relaxed text-ink-800">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
                {hours ? (
                  <Stat icon={Clock} label="Course length" value={hours} />
                ) : null}
                {totals.lessonCount > 0 ? (
                  <Stat
                    icon={BookOpen}
                    label="Content"
                    value={`${totals.moduleCount} modules · ${totals.lessonCount} lessons`}
                  />
                ) : null}
              </dl>

              {rating ? (
                <div className="mt-6 flex items-center gap-3">
                  <Stars rating={rating} />
                  <span className="text-sm text-ink-600">
                    <strong className="text-ink-900">{rating.toFixed(1)}</strong> from{" "}
                    {reviews.length} verified student
                    {reviews.length === 1 ? "" : "s"}
                  </span>
                </div>
              ) : null}

            </div>

            {/* media column */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              {video ? (
                <>
                  <p className="eyebrow text-center">Course Overview</p>
                  <div className="mt-4 rounded-hero bg-brand-950 p-2.5 shadow-card">
                    <VideoPlayer src={video} title={`${course.title} overview`} />
                  </div>
                </>
              ) : (
                purchaseCard
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- pricing (2) ---------------------------- */}
      {/* Courses that lead with a video put pricing in its own section, the way
          the original site lays them out. Plain catalog courses keep the card
          in the hero, where it is the page's primary action. */}
      {features ? (
        <SinglePlanPricing
          wasPrice={formatPrice(course.price_cents)}
          price={formatPrice(payableCents)}
          deal={`${PROMO.percentOff}% OFF`}
          instalment={`As low as 4 interest-free payments of ${formatPrice(
            Math.round(payableCents / 4),
          )} with`}
          features={features}
          enrollItem={{
            courseId: course.id,
            slug: course.slug,
            title: course.title,
            priceCents: course.price_cents,
            trackSlug: course.track?.slug ?? "real-estate",
            hours: course.hours,
          }}
        />
      ) : video ? (
        <section className="border-b border-ink-200/70 bg-sand-50">
          <div className="container-page flex justify-center py-14 lg:py-16">
            <div className="w-full max-w-sm">{purchaseCard}</div>
          </div>
        </section>
      ) : null}

      {/* ------------------------ what to expect (3) ------------------------ */}
      {stats ? <StatsBand stats={stats} /> : null}

      {/* --------------------------- exam chart (4) ------------------------- */}
      {examChart ? (
        <ExamChart
          title={examChart.title}
          blurbLead={examChart.blurbLead}
          blurbLink={examChart.blurbLink}
          bars={examChart.bars}
        />
      ) : null}

      {/* -------------------------- instructors (5) ------------------------- */}
      {/* Shown on marketing-style course pages; the band defaults to the
          shared staff list, so there is no per-course data to keep in sync. */}
      {highlights ? <InstructorsBand /> : null}

      {/* ------------------------------ body -------------------------------- */}
      {/* Marketing-style pages mirror the original, which has no syllabus,
          "what is included" grid or side rail — their sections carry it all. */}
      {highlights ? null : (
      <div className="container-page grid gap-14 py-14 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:py-20">
        <div className="min-w-0 space-y-16">
          {/* description */}
          {course.description && !heroIntro ? (
            <section>
              <h2 className="font-display text-2xl">About this course</h2>
              <div className="prose-flca mt-4 max-w-none">
                {course.description.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ) : null}

          {/* syllabus */}
          <section id="syllabus" className="scroll-mt-28">
            <h2 className="font-display text-2xl">
              {isExtension ? "How the extension works" : "Course syllabus"}
            </h2>

            {course.modules.length === 0 ? (
              <div className="mt-4 rounded-card border border-ink-200 bg-ink-50 p-6 text-sm leading-relaxed text-ink-600">
                {isExtension
                  ? "This is an add-on, not a standalone course. Purchasing it extends the access window on a course you already own — pick which course to extend from your dashboard right after checkout."
                  : "The full module breakdown is released inside the course player. Enrol to see every module, lesson and quiz."}
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-ink-500">
                  {totals.moduleCount} modules · {totals.lessonCount} lessons ·{" "}
                  {formatDuration(totals.minutes)} of guided content
                </p>
                <ol className="mt-6 space-y-3">
                  {course.modules.map((module, index) => (
                    <li
                      key={module.id}
                      className="overflow-hidden rounded-card border border-ink-200 bg-white"
                    >
                      <div className="flex items-center gap-4 border-b border-ink-100 bg-ink-50/70 px-5 py-3.5">
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-medium text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          {index + 1}
                        </span>
                        <h3 className="min-w-0 flex-1 font-display text-base">
                          {module.title}
                        </h3>
                        <span className="shrink-0 text-xs text-ink-500">
                          {module.lessons.length} lesson
                          {module.lessons.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      {module.lessons.length ? (
                        <ul className="divide-y divide-ink-100">
                          {module.lessons.map((lesson) => {
                            const Icon = LESSON_ICON[lesson.kind] ?? FileText;
                            return (
                              <li
                                key={lesson.id}
                                className="flex items-center gap-3 px-5 py-3 text-sm"
                              >
                                <Icon
                                  className="size-4 shrink-0 text-ink-400"
                                  aria-hidden
                                />
                                <span className="min-w-0 flex-1 text-ink-700">
                                  {lesson.title}
                                </span>
                                <span className="shrink-0 text-xs text-ink-400">
                                  {formatDuration(lesson.duration_minutes)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>

          {/* what's included */}
          <section>
            <h2 className="font-display text-2xl">What&apos;s included</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {included.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="rounded-card border border-ink-200 bg-white p-5"
                >
                  <Icon className="size-5 text-brand-600" aria-hidden />
                  <p className="mt-3 font-medium text-ink-900">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* faq — only when the course has no bespoke set (rendered below) */}
          {faqs ? null : (
          <CourseFaq
            courseTitle={course.title}
            hours={hours}
            accessDays={course.access_days ?? 365}
            passingScore={course.passing_exam_score ?? 70}
            isExtension={isExtension}
          />
          )}

          {/* reviews — hidden on marketing-style pages, which carry the
              Google reviews band below instead of two review sections */}
          <section
            id="reviews"
            className={cn("scroll-mt-28", highlights && "hidden")}
          >
            <h2 className="font-display text-2xl">Student reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-4 rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-10 text-center text-sm text-ink-500">
                No reviews for this course yet. Students who complete it can leave
                the first one.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-card border border-ink-200 bg-white p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Stars rating={review.rating} />
                      <Badge variant="success" size="sm">
                        <BadgeCheck aria-hidden /> Verified purchase
                      </Badge>
                    </div>
                    {review.body ? (
                      <p className="mt-3 text-sm leading-relaxed text-ink-600">
                        {review.body}
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm font-medium text-ink-900">
                      {review.author?.full_name ?? "Verified student"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ---------------------------- side rail --------------------------- */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <nav
            aria-label="On this page"
            className="rounded-card border border-ink-200 bg-white p-5"
          >
            <p className="mb-3 text-xs font-medium tracking-wider text-ink-500 uppercase">
              On this page
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Syllabus", href: "#syllabus" },
                { label: "FAQ", href: "#faq" },
                { label: "Reviews", href: "#reviews" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-ink-600 hover:text-brand-700 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-card border border-brand-200 bg-brand-50 p-5">
            <ShieldCheck className="size-5 text-brand-700" aria-hidden />
            <p className="mt-3 font-display text-base text-brand-900">
              Approved &amp; reported
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-800">
              This course is approved by the Florida DBPR. Your completion is
              reported electronically — you never have to mail a certificate.
            </p>
          </div>
        </aside>
      </div>
      )}

      {/* ------------------------------ faq (6) ---------------------------- */}
      {faqs ? <FaqAccordion items={faqs} /> : null}

      {/* -------------------------- google reviews (7) ---------------------- */}
      {highlights ? <GoogleReviewsBand /> : null}

      {/* ----------------------- related resources (8) ---------------------- */}
      {highlights ? <RelatedResources /> : null}

      {/* --------------------------- related courses ------------------------ */}
      {/* Not on the original marketing pages, so gated the same way. */}
      {!highlights && related.filter((c) => c.id !== course.id).length ? (
        <section className="border-t border-ink-200/70 bg-white">
          <div className="container-page py-14 lg:py-20">
            <SectionHeading
              title={
                course.track
                  ? `More ${trackLabel(course.track.slug)} courses`
                  : "More courses"
              }
              action={
                <ButtonLink href={`/${course.track?.slug}`} variant="outline">
                  View track
                </ButtonLink>
              }
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related
                .filter((c) => c.id !== course.id)
                .slice(0, 3)
                .map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* mobile sticky enrol bar */}
      <div className="sticky bottom-0 z-40 border-t border-ink-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink-500">{course.title}</p>
            <p className="font-display text-lg">
              {course.price_cents === 0 ? "Free" : formatPrice(course.price_cents)}
            </p>
          </div>
          <div className="w-40 shrink-0">
            <AddToCartButton
              size="md"
              owned={owned}
              item={{
                courseId: course.id,
                slug: course.slug,
                title: course.title,
                priceCents: course.price_cents,
                trackSlug: course.track?.slug ?? "real-estate",
                hours: course.hours,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-ink-500 uppercase">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink-900">{value}</dd>
    </div>
  );
}
