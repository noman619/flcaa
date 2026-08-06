import Image from "next/image";

/**
 * The extensions banner, shared by the real estate and CAM extension pages.
 *
 * The original runs identical copy and artwork on both, so one definition
 * here rather than two that can drift.
 *
 * Light band rather than the navy the course pages use: this is an
 * administrative errand, not an offer, and a visitor arrives here already
 * sold. The artwork sits on the same field as the page so the illustration's
 * white ground has nothing to disagree with.
 */
export const EXTENSION_HERO = {
  title: "Extensions or Reactivations",
  body: [
    "If your online course is near its expiration date or has already expired, you may purchase an extension. Most courses are valid for 6 months.",
    "Extensions or reactivations may be granted for up to 18 months from the initial purchase date of the course. If the course has hit the 18-month limit, learners may also elect to re-enroll and restart the course.",
  ],
  image: {
    src: "/extension/extensions-hero.jpg",
    alt: "An illustration of a large clock and a calendar, with learners marking dates",
  },
} as const;

export function ExtensionHero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/70 bg-mist-50">
      <span
        className="pointer-events-none absolute -top-40 -right-32 size-112 rounded-full bg-brand-100/60 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="reveal">
          <h1 className="font-display text-[2rem] leading-[1.1] font-medium text-leaf-600 lg:text-[2.75rem]">
            {EXTENSION_HERO.title}
          </h1>

          {EXTENSION_HERO.body.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-6 max-w-lg text-[15px] leading-relaxed text-brand-700"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="reveal min-w-0">
          <Image
            src={EXTENSION_HERO.image.src}
            alt={EXTENSION_HERO.image.alt}
            width={1000}
            height={558}
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
