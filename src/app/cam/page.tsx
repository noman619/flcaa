import type { Metadata } from "next";
import { TrackLanding } from "@/components/marketing/track-landing";

export const metadata: Metadata = {
  title: "Florida CAM School — Community Association Manager Courses",
  description:
    "Florida CAM licensing course, community association manager continuing education and state exam prep. Approved, self-paced and online.",
  alternates: { canonical: "/cam" },
  openGraph: {
    title: "Florida CAM School",
    description:
      "CAM licensing, continuing education and state exam prep for Florida community association managers.",
    url: "/cam",
  },
};

export default function CamPage() {
  return <TrackLanding slug="cam" />;
}
