import { GuideCourses } from "@/components/marketing/guide-courses";
import { PageHero } from "@/components/marketing/page-hero";
import { NAV_RESOURCES, type ResourceGuide } from "@/lib/site";

/**
 * Default shell for the static Resources guides.
 *
 * The routes, URLs, metadata and internal linking are real — only the prose is
 * still to be ported from the original site (see each entry's `sourceUrl`).
 * A guide whose copy has been ported composes its own sections instead of
 * using this (see /how-to-get-real-estate-license-in-florida).
 */
export function GuidePage({ guide }: { guide: ResourceGuide }) {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={guide.title}
        description={guide.description}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: NAV_RESOURCES.href },
          { label: guide.label },
        ]}
      />

      <div className="container-page max-w-3xl py-16 lg:py-20">
        <div className="prose-flca">
          <p>
            We are rebuilding this guide. In the meantime, the courses below
            cover everything it describes, and our team can answer any question
            directly.
          </p>
        </div>
      </div>

      <GuideCourses guide={guide} />
    </>
  );
}
