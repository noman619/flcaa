import type { Metadata } from "next";
import { TrackLanding } from "@/components/marketing/track-landing";

export const metadata: Metadata = {
  title: "Florida HOA & Condo Board Member Certification",
  description:
    "State-approved certification for newly elected HOA and condo board members, plus board continuing education. Complete online in one sitting.",
  alternates: { canonical: "/board-members" },
  openGraph: {
    title: "Florida Board Member Certification",
    description:
      "Newly elected director certification and board continuing education for Florida HOA and condo boards.",
    url: "/board-members",
  },
};

export default function BoardMembersPage() {
  return <TrackLanding slug="board-members" />;
}
