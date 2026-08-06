import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageHero } from "@/components/marketing/page-hero";

export function LegalPage({
  title,
  intro,
  updated,
  body,
}: {
  title: string;
  intro?: string;
  updated: string;
  body: string;
}) {
  return (
    <>
      <PageHero
        eyebrow={`Last updated ${updated}`}
        title={title}
        description={intro}
        breadcrumb={[{ label: "Home", href: "/" }, { label: title }]}
      />

      <div className="container-page max-w-3xl py-16 lg:py-20">
        <div className="prose-flca">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}
