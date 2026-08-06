import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type TopicCourse = {
  /** Category, e.g. "CAM Legal Updates". */
  category: string;
  hours: string;
  title: string;
  price: string;
  image: string;
  href: string;
};

/**
 * The à-la-carte courses behind a bundle — one card per topic.
 *
 * Each card names the category, the hours it carries and the single course
 * that fills it, so a visitor who only needs one topic can find it without
 * reading the bundle. The price sits beside the title, not under the button,
 * because the comparison a visitor makes here is topic against topic.
 */
export function TopicCourseCards({
  title,
  intro,
  items,
  titleVariant = "heading",
}: {
  title: string;
  intro?: string;
  items: readonly TopicCourse[];
  /**
   * The RE CE page sets this label in a filled pill rather than as a heading —
   * it reads as the tab on a drawer of à-la-carte courses, which is what the
   * original draws. Still an <h2>: it names the section either way.
   */
  titleVariant?: "heading" | "pill";
}) {
  /* Off-site targets open in a new tab and skip the client router. */
  const linkProps = (href: string) =>
    href.startsWith("http")
      ? { href, target: "_blank" as const, rel: "noreferrer" }
      : { href };

  return (
    <section className="border-b border-ink-200/70 bg-sand-100">
      {/* The pill variant follows a lead band that already opened the section,
          so it starts tighter than a run that has to introduce itself. */}
      <div
        className={
          titleVariant === "pill"
            ? "container-page pt-10 pb-16 lg:pt-12 lg:pb-20"
            : "container-page py-16 lg:py-24"
        }
      >
        <div className="reveal mx-auto max-w-2xl text-center">
          {titleVariant === "pill" ? (
            <h2 className="inline-flex rounded-full bg-brand-600 px-8 py-3.5 font-display text-[1.15rem] leading-none text-white shadow-card lg:text-[1.35rem]">
              {title}
            </h2>
          ) : (
            <h2 className="font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
              {title}
            </h2>
          )}
          {intro ? (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
              {intro}
            </p>
          ) : null}
        </div>

        <ul
          className={`flex flex-wrap justify-center gap-6 ${
            titleVariant === "pill" ? "mt-8 lg:mt-10" : "mt-12 lg:mt-14"
          }`}
        >
          {items.map((item) => (
            <li
              /* Category alone is not unique — the RE CE run has two
                 specialty-credit cards. */
              key={`${item.category}-${item.title}`}
              className="reveal w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <Link
                {...linkProps(item.href)}
                className="group flex h-full flex-col overflow-hidden rounded-panel border border-ink-200/60 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-sand-50">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-6 transition-transform duration-500 ease-out-soft group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg text-ink-950">
                    {item.category}
                  </h3>
                  <p className="mt-1 text-[11px] font-medium tracking-[0.16em] text-ink-500 uppercase">
                    {item.hours}
                  </p>

                  <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">
                    <span className="block text-[11px] tracking-[0.14em] text-ink-400 uppercase">
                      Course title
                    </span>
                    {item.title}
                  </p>

                  <p className="mt-4 font-display text-xl text-brand-700">
                    {item.price}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-700 transition-colors duration-200 group-hover:text-brand-900">
                    More details
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
