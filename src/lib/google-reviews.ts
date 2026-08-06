import { GOOGLE_PLACES_API_KEY } from "@/lib/env";

/**
 * The Google Business Profile behind the reviews.
 *
 * Taken from the live site's EmbedSocial widget config, which declares the
 * source as `{"sourceType":"google","sourceSubtype":"place","sourceId":"…"}`.
 * That sourceId is the Google place_id, which is all the Places API needs.
 */
export const GOOGLE_PLACE = {
  id: "ChIJLycr7kKr2YgRfWneu4oItlo",
  name: "Prolicense Florida",
  city: "Hallandale Beach",
  profileUrl: "https://maps.google.com/maps?cid=6536421301125278077",
  leaveAReviewUrl:
    "https://search.google.com/local/writereview?placeid=ChIJLycr7kKr2YgRfWneu4oItlo",
} as const;

export type GoogleReview = {
  author: string;
  when: string;
  rating: number;
  body: string;
  photo?: string;
  /** True when the text was transcribed from a "See more" clamp, not the API. */
  truncated?: boolean;
};

export type GoogleReviewsData = {
  score: number;
  count: number;
  reviews: readonly GoogleReview[];
  /** Where the data came from, so the UI can be honest about it. */
  live: boolean;
};

/**
 * Fallback set, used when GOOGLE_PLACES_API_KEY is unset.
 *
 * The live site renders reviews through a third-party widget that fetches at
 * runtime, so none of this is in its HTML — these were transcribed from the
 * rendered widget. Entries marked `truncated` were cut off by the widget's own
 * "See more" and stop where they stopped being readable, rather than inventing
 * a tail. The widget config reports 1148 total.
 */
const FALLBACK: GoogleReviewsData = {
  score: 5.0,
  count: 1148,
  live: false,
  reviews: [
    {
      author: "Jim",
      when: "a week ago",
      rating: 5,
      body: "Prolicense Florida is the absolute best! I've now used them for state-required board education and to very quickly earn my CAM license. The topics they teach are spot-on relevant to the key areas of focus on the exam. I…",
      truncated: true,
    },
    {
      author: "Ivonne",
      when: "2 weeks ago",
      rating: 5,
      body: "Prolicense Florida was the best choice I could have made to learn everything I need to get my CAM License! I passed the test and got my CAM in an instant!!!! The best company to choose and I highly recommend them!!!!",
    },
    {
      author: "Katrin",
      when: "2 months ago",
      rating: 5,
      body: "The course was easy to pass and my exam prep is very helpful for passing your CAM exam! I just passed the CAM exam after studying from the exam…",
      truncated: true,
    },
    {
      author: "Michael",
      when: "2 months ago",
      rating: 5,
      body: "Great platform to use. A lot of the questions on study guide are on the actual test.",
    },
    {
      author: "Judi",
      when: "2 months ago",
      rating: 5,
      body: "Super easy system and very helpful. I passed the Florida CAM Exam on the 1st attempt thanks to all of the unlimited practice tests available…",
      truncated: true,
    },
  ],
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; photoUri?: string };
  }[];
};

/**
 * Live rating, review count and reviews for the business.
 *
 * Cached for an hour by the fetch cache — reviews change slowly and this is
 * a billed API call. Any failure (no key, quota, network, shape change) falls
 * back to the transcribed set: a marketing badge must never take the page down.
 *
 * Known limit: Places Details returns at most 5 reviews, and Google chooses
 * which. There is no first-party API that returns all 1,148.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  if (!GOOGLE_PLACES_API_KEY) return FALLBACK;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${GOOGLE_PLACE.id}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as PlacesResponse;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        when: r.relativePublishTimeDescription ?? "",
        rating: r.rating ?? 5,
        body: r.text?.text ?? r.originalText?.text ?? "",
        photo: r.authorAttribution?.photoUri,
      }))
      .filter((r) => r.body.length > 0);

    if (!reviews.length) return FALLBACK;

    return {
      score: data.rating ?? FALLBACK.score,
      count: data.userRatingCount ?? FALLBACK.count,
      reviews,
      live: true,
    };
  } catch {
    return FALLBACK;
  }
}

/** Stable avatar tint per author, so a name always gets the same colour. */
export function avatarTone(name: string) {
  const tones = [
    "bg-brand-600",
    "bg-accent-600",
    "bg-leaf-600",
    "bg-gold-500",
    "bg-ink-700",
  ];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return tones[hash % tones.length];
}
