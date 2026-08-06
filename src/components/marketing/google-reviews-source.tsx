import {
  GoogleReviewsBadge,
  GoogleReviewsSection,
} from "@/components/marketing/google-reviews";
import { getGoogleReviews } from "@/lib/google-reviews";

/**
 * Server half of the reviews UI: fetches the Google Place data and hands it to
 * the client components. Keeps GOOGLE_PLACES_API_KEY server-side, and keeps the
 * fetch out of the browser's critical path.
 */
export async function GoogleReviews() {
  return <GoogleReviewsBadge data={await getGoogleReviews()} />;
}

export async function GoogleReviewsBand() {
  return <GoogleReviewsSection data={await getGoogleReviews()} />;
}
