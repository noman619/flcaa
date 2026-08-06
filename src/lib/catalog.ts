import type { OfferingType, TrackSlug } from "@/lib/database.types";

/** Display metadata for each offering type, plus the order they appear in. */
export const OFFERING_TYPES: Record<
  OfferingType,
  { label: string; plural: string; blurb: string; sort: number }
> = {
  licensing: {
    label: "Licensing Course",
    plural: "Licensing Courses",
    blurb: "The state-required pre-license education you need before sitting the exam.",
    sort: 1,
  },
  post_licensing: {
    label: "Post-Licensing Course",
    plural: "Post-Licensing Courses",
    blurb: "Required after your first license renewal cycle to keep your license active.",
    sort: 2,
  },
  certification: {
    label: "Certification",
    plural: "Certification",
    blurb: "Certification training for newly elected directors.",
    sort: 3,
  },
  exam_prep: {
    label: "State Exam Prep",
    plural: "State Exam Prep",
    blurb: "Practice exams and flashcards built from real state exam question banks.",
    sort: 4,
  },
  continuing_education: {
    label: "Continuing Education",
    plural: "Continuing Education",
    blurb: "Stay compliant each renewal cycle with approved CE hours.",
    sort: 5,
  },
  course_extension: {
    label: "Course Extension",
    plural: "Course Extension",
    blurb: "Out of time? Extend access to a course you already own.",
    sort: 6,
  },
};

export const OFFERING_ORDER = (Object.keys(OFFERING_TYPES) as OfferingType[]).sort(
  (a, b) => OFFERING_TYPES[a].sort - OFFERING_TYPES[b].sort,
);

/**
 * Track theming. The DB carries accent_color, but Tailwind needs static class
 * names, so the palette lives here keyed by track slug.
 */
export const TRACK_THEME: Record<
  TrackSlug,
  {
    accent: string;
    accentSoft: string;
    accentText: string;
    ring: string;
    bg: string;
    border: string;
  }
> = {
  /* Each track takes one hue from the wordmark: navy, red, green. */
  "real-estate": {
    accent: "#1C395B",
    accentSoft: "#EEF3F9",
    accentText: "text-[#14273D]",
    ring: "ring-[#1C395B]",
    bg: "bg-[#EEF3F9]",
    border: "border-[#D8E3F0]",
  },
  cam: {
    accent: "#B62B3C",
    accentSoft: "#FDF2F3",
    accentText: "text-[#7D1F2C]",
    ring: "ring-[#B62B3C]",
    bg: "bg-[#FDF2F3]",
    border: "border-[#FBE1E3]",
  },
  "board-members": {
    accent: "#467D2F",
    accentSoft: "#F1F8EC",
    accentText: "text-[#2F4F22]",
    ring: "ring-[#467D2F]",
    bg: "bg-[#F1F8EC]",
    border: "border-[#DFF0D4]",
  },
};

export const TRACK_ORDER: TrackSlug[] = ["real-estate", "cam", "board-members"];

export function trackTheme(slug: string) {
  return TRACK_THEME[slug as TrackSlug] ?? TRACK_THEME["real-estate"];
}

export function offeringLabel(type: OfferingType) {
  return OFFERING_TYPES[type]?.label ?? type;
}
