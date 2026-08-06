"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import {
  GOOGLE_PLACE,
  avatarTone,
  type GoogleReview,
  type GoogleReviewsData,
} from "@/lib/google-reviews";

/** Google's four-colour mark. Inline so it costs no request and scales cleanly. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="flex flex-col rounded-panel border border-ink-200/70 bg-white p-6 text-center shadow-card">
      {review.photo ? (
        <Image
          src={review.photo}
          alt=""
          width={96}
          height={96}
          unoptimized
          className="mx-auto size-12 rounded-full object-cover"
        />
      ) : (
        <span
          className={`mx-auto flex size-12 items-center justify-center rounded-full font-display text-lg text-white ${avatarTone(review.author)}`}
          aria-hidden
        >
          {review.author.charAt(0)}
        </span>
      )}

      <figcaption className="mt-4">
        <p className="text-[15px] font-medium text-ink-900">{review.author}</p>
        {review.when ? (
          <p className="mt-0.5 text-xs text-ink-500">{review.when}</p>
        ) : null}
      </figcaption>

      <Stars rating={review.rating} className="mt-3 justify-center" />

      <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-ink-600">
        {review.body}
      </blockquote>

      <GoogleMark className="mx-auto mt-5 size-5" />
    </figure>
  );
}

/** Reviews revealed per press of "Load more". */
const PAGE_SIZE = 4;

/**
 * The modal itself, driven by a ref so any trigger can open it.
 *
 * Presentation only — data is fetched on the server by `getGoogleReviews()`
 * and passed in, so no API key ever reaches the browser. Paging resets on
 * close, so a reopened dialog always starts at the top of the list.
 *
 * Native <dialog> for the same reasons as the free-trial modal: focus trap,
 * Escape, inert background and top-layer stacking without a line of state
 * management. The list scrolls inside the dialog rather than the page, so the
 * background never moves under the overlay.
 */
function ReviewsDialog({
  data,
  dialogRef,
}: {
  data: GoogleReviewsData;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const [shown, setShown] = React.useState(PAGE_SIZE);
  const { score, count, reviews } = data;
  const remaining = reviews.length - shown;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="google-reviews-title"
      onClose={() => setShown(PAGE_SIZE)}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-auto w-[min(62rem,calc(100vw-2rem))] rounded-panel bg-sand-50 p-0 shadow-card-hover backdrop:bg-ink-950/60"
    >
      <div className="max-h-[min(80vh,48rem)] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-ink-200/70 bg-sand-50/95 px-7 py-6 backdrop-blur lg:px-9">
          <div>
            <h2 id="google-reviews-title" className="font-display text-2xl text-ink-950">
              Google Reviews
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Stars rating={score} />
              <p className="text-sm text-ink-600">
                {score.toFixed(1)} rating of {count.toLocaleString("en-US")} reviews
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="grid gap-5 px-7 py-7 sm:grid-cols-2 lg:px-9">
          {reviews.slice(0, shown).map((review) => (
            <ReviewCard key={review.author + review.when} review={review} />
          ))}
        </div>

        {remaining > 0 ? (
          <div className="px-7 pb-7 text-center lg:px-9">
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE_SIZE)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-200 bg-white px-6 text-[13.5px] font-medium text-ink-800 shadow-xs transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-px hover:border-ink-300 hover:shadow-card"
            >
              Load more reviews
              <span className="text-ink-400">({remaining})</span>
              <ChevronDown className="size-4" aria-hidden />
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ink-200/70 px-7 py-6 text-sm lg:px-9">
          <a
            href={GOOGLE_PLACE.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand-700 underline underline-offset-4 hover:text-brand-900"
          >
            See all reviews on Google
          </a>
          <a
            href={GOOGLE_PLACE.leaveAReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand-700 underline underline-offset-4 hover:text-brand-900"
          >
            Write a review
          </a>
        </div>
      </div>
    </dialog>
  );
}

/** Compact rating badge for the pricing trust rail. Opens the full list. */
export function GoogleReviewsBadge({ data }: { data: GoogleReviewsData }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const { score, count } = data;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="group w-full rounded-panel border border-ink-200/70 bg-white px-5 py-4 text-center shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-card-hover"
      >
        <GoogleMark className="mx-auto size-6" />
        <Stars rating={score} className="mt-2 justify-center" />
        <p className="mt-2 text-[13px] text-ink-700">
          <span className="font-medium text-ink-950">{score.toFixed(1)}</span> rating
          from{" "}
          <span className="font-medium text-ink-950">
            {count.toLocaleString("en-US")}
          </span>{" "}
          reviews
        </p>
        <span className="mt-2 inline-block text-xs text-brand-700 underline underline-offset-4">
          Read reviews
        </span>
      </button>

      <ReviewsDialog data={data} dialogRef={ref} />
    </>
  );
}

/**
 * Full-width reviews section, in the slot the original site gives its Google
 * Reviews widget — between the reciprocity band and the FAQ.
 */
export function GoogleReviewsSection({ data }: { data: GoogleReviewsData }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const { score, count, reviews } = data;

  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <div className="text-center">
          <GoogleMark className="mx-auto size-7" />
          <h2 className="mt-4 font-display text-[1.9rem] text-ink-950 lg:text-[2.4rem]">
            Our latest reviews on Google
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Stars rating={score} />
            <p className="text-sm text-ink-600">
              {score.toFixed(1)} rating of {count.toLocaleString("en-US")} reviews
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.author + review.when} className="reveal">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => ref.current?.showModal()}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-800 px-7 text-sm font-medium text-white transition-[transform,box-shadow,background-color] duration-300 ease-out-soft hover:-translate-y-px hover:bg-brand-900 hover:shadow-brand"
          >
            Read all reviews
          </button>
        </div>

        <ReviewsDialog data={data} dialogRef={ref} />
      </div>
    </section>
  );
}
