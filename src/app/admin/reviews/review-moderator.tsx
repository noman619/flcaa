"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/stars";
import { Alert } from "@/components/ui/alert";
import { moderateReview } from "@/app/dashboard/actions";
import { formatShortDate } from "@/lib/utils";

type Row = {
  id: string;
  rating: number;
  body: string | null;
  is_published: boolean;
  created_at: string;
  course: { title: string } | null;
  author: { full_name: string | null } | null;
};

export function ReviewModerator({ reviews }: { reviews: Row[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function toggle(review: Row) {
    setPendingId(review.id);
    setError(null);
    const res = await moderateReview(review.id, !review.is_published);
    setPendingId(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  if (!reviews.length) {
    return (
      <p className="rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-12 text-center text-sm text-ink-500">
        No reviews submitted yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <Alert tone="error">{error}</Alert> : null}

      <ul className="space-y-3">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-card border border-ink-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars rating={review.rating} size={14} />
                  <Badge
                    variant={review.is_published ? "success" : "warning"}
                    size="sm"
                  >
                    {review.is_published ? "Published" : "Awaiting moderation"}
                  </Badge>
                </div>
                {review.body ? (
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">
                    {review.body}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-ink-400">
                    Rating only — no written review.
                  </p>
                )}
                <p className="mt-3 text-xs text-ink-400">
                  {review.author?.full_name ?? "Student"} ·{" "}
                  {review.course?.title ?? "Course"} ·{" "}
                  {formatShortDate(review.created_at)}
                </p>
              </div>

              <Button
                size="sm"
                variant={review.is_published ? "outline" : "primary"}
                onClick={() => toggle(review)}
                disabled={pendingId === review.id}
              >
                {pendingId === review.id ? (
                  <Loader2 className="animate-spin" />
                ) : review.is_published ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
                {review.is_published ? "Hide" : "Publish"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
