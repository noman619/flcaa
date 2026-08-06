import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { averageRating, getPublishedReviews } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { Stars } from "@/components/ui/stars";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { formatShortDate } from "@/lib/utils";
import { PageHero } from "@/components/marketing/page-hero";
import { ReviewPlatforms } from "@/components/marketing/review-platforms";

export const metadata: Metadata = {
  title: "Student Reviews",
  description:
    "Verified reviews from students who completed our Florida real estate, CAM and board member certification courses.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const [reviews, user] = await Promise.all([
    getPublishedReviews(),
    getCurrentUser(),
  ]);

  const avg = averageRating(reviews);
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      <PageHero
        eyebrow="Verified feedback"
        title="Student reviews"
        description="Only students who actually bought and completed a course can leave a review. Every review below is tied to a verified enrollment."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />

      {/* The original /review page is exactly this panel — see the component. */}
      <ReviewPlatforms />

      <div className="container-page py-14 lg:py-20">
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title="No published reviews yet"
            description="Reviews appear here after students complete a course and pass moderation."
            action={<ButtonLink href="/courses">Browse courses</ButtonLink>}
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-card border border-ink-200 bg-white p-6 shadow-card lg:sticky lg:top-28">
              <p className="font-display text-5xl">
                {avg?.toFixed(1)}
              </p>
              <Stars rating={avg ?? 0} className="mt-2" />
              <p className="mt-2 text-sm text-ink-500">
                Based on {reviews.length} verified review
                {reviews.length === 1 ? "" : "s"}
              </p>

              <ul className="mt-6 space-y-2">
                {distribution.map(({ star, count }) => {
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <li key={star} className="flex items-center gap-2.5 text-xs">
                      <span className="w-8 text-ink-500">{star}★</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                        <span
                          className="block h-full rounded-full bg-accent-400"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-6 text-right text-ink-500">{count}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 border-t border-ink-100 pt-5">
                <p className="text-sm font-medium text-ink-900">
                  Completed a course?
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  Leave your review from your account settings.
                </p>
                <ButtonLink
                  href={user ? "/dashboard/settings" : "/login?next=%2Fdashboard%2Fsettings"}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  block
                >
                  Leave a review
                </ButtonLink>
              </div>
            </aside>

            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-card border border-ink-200 bg-white p-6 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Stars rating={review.rating} />
                    <Badge variant="success" size="sm">
                      Verified purchase
                    </Badge>
                  </div>
                  {review.body ? (
                    <p className="mt-4 text-sm leading-relaxed text-ink-600">
                      {review.body}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-4 text-sm">
                    <span className="font-medium text-ink-900">
                      {review.author?.full_name ?? "Verified student"}
                    </span>
                    <span className="text-xs text-ink-400">
                      {review.course ? (
                        <Link
                          href={`/courses/${review.course.slug}`}
                          className="hover:underline"
                        >
                          {review.course.title}
                        </Link>
                      ) : null}
                      {" · "}
                      {formatShortDate(review.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
