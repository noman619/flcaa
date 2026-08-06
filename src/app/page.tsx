import Image from "next/image";
import { ArrowRight, CalendarClock, MessageCircle, Wallet } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { VideoSection } from "@/components/marketing/video-section";
import { TrackCard } from "@/components/marketing/track-card";
import { ButtonLink } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { RecentPosts } from "@/components/marketing/recent-posts";
import {
  averageRating,
  getPublishedPosts,
  getPublishedReviews,
  getTracks,
} from "@/lib/queries";
import { NAV_TRACKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

// The catalog changes rarely; regenerate hourly instead of per-request.
export const revalidate = 3600;

const VALUE_PROPS = [
  {
    icon: CalendarClock,
    title: "Flexible",
    body: "100% self-paced and online. Start today, study at 6am or midnight, and pick up on any device exactly where you stopped.",
  },
  {
    icon: Wallet,
    title: "Affordable",
    body: "Straightforward pricing with no hidden 'activation' or proctoring surprises. Bundle a course with exam prep and save.",
  },
  {
    icon: MessageCircle,
    title: "Individual attention",
    body: "Message a licensed Florida instructor from inside any lesson. Real answers from real people, not a ticket queue.",
  },
];

export default async function HomePage() {
  const [tracks, reviews, posts] = await Promise.all([
    getTracks(),
    getPublishedReviews({ limit: 3 }),
    getPublishedPosts(3),
  ]);

  const avg = averageRating(reviews);

  return (
    <>
      {/* ------------------------------- hero -------------------------------
          Editorial split: an ivory type panel on the left, a full-bleed
          photograph on the right, cut on a diagonal so the two planes meet on
          an angle rather than a straight seam. */}
      <section className="relative isolate overflow-hidden bg-sand-100">
        {/* Right panel — diagonal on desktop, a plain band on small screens. */}
        <div className="relative h-64 w-full overflow-hidden bg-ink-100 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%] lg:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]">
          <Image
            src="/hero-student.png"
            alt="A student studying a Florida licensing course on her phone at home."
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover object-[62%_center]"
          />
          {/* Warms the photo into the ivory panel and keeps the seam soft. */}
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgb(246 243 236 / 0.85) 0%, rgb(246 243 236 / 0.12) 26%, transparent 46%)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative container-page py-16 lg:py-32">
          <div className="max-w-xl lg:max-w-[46%]">
            <p className="flex items-center gap-4 text-[11px] font-medium tracking-[0.2em] text-ink-500 uppercase">
              <span className="h-px w-10 bg-ink-400" aria-hidden />
              Florida licensing, done properly
            </p>

            <h1 className="mt-8 font-display text-[2.25rem] leading-[1.08] tracking-[-0.03em] text-ink-900 sm:text-[2.75rem] lg:text-[3.25rem]">
              Earn or Renew Your Florida Professional License Faster —{" "}
              <span className="text-brand-700">
                100% Online, State-Approved Courses
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-[15px] leading-[1.85] text-ink-600">
              Join 57,000+ active learners. Benefit from our 87%+ exam pass rate,
              24/7 instructor support, and our 30-day refund guarantee.
            </p>

            <div className="mt-11 flex flex-wrap items-center gap-4">
              <ButtonLink
                href="/courses"
                size="lg"
                variant="dark"
                className="group/cta gap-5 px-8"
              >
                Explore our courses
                <span
                  className="inline-block transition-transform duration-300 ease-out-soft group-hover/cta:translate-x-1.5"
                  aria-hidden
                >
                  ⟶
                </span>
              </ButtonLink>

              {avg ? (
                <span className="flex items-center gap-2.5">
                  <Stars rating={avg} size={14} />
                  <span className="text-xs text-ink-500">
                    <strong className="font-medium text-ink-900">
                      {avg.toFixed(1)}
                    </strong>{" "}
                    from {reviews.length} verified student
                    {reviews.length === 1 ? "" : "s"}
                  </span>
                </span>
              ) : null}
            </div>

            <dl className="mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-ink-300/60 pt-8">
              {SITE.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="tabular block font-display text-2xl text-ink-900">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-snug tracking-wide text-ink-500 uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------------------- track cards ---------------------------
          id="tracks": linked to from the board certification FAQ, so the
          anchor has to survive edits to this section's copy. */}
      <Section id="tracks" className="scroll-mt-24 bg-white">
        <SectionHeading
          eyebrow="Choose your track"
          title="Three schools, one student account"
          description="Every program is delivered online and self-paced. Buy once and it lands in the same dashboard as everything else you own."
        />
        <div className="grid gap-7 lg:grid-cols-3">
          {tracks.map((track) => {
            const nav = NAV_TRACKS.find((t) => t.slug === track.slug);
            return (
              <TrackCard
                key={track.id}
                track={track}
                href={nav?.href ?? `/${track.slug}`}
                popularTopics={(nav?.links ?? []).slice(0, 5).map((l) => ({
                  label: l.label,
                  href: l.href,
                }))}
              />
            );
          })}
        </div>
      </Section>

      {/* ------------------------------ video ------------------------------- */}
      <VideoSection
        title="Online Education for Professionals and Association Board Members in Florida."
        videoId="L00ak07qXgU"
      />

      {/* --------------------------- value props ----------------------------
          Dashed-outline cards with the icon disc breaking the top edge. The
          middle card inverts to a deep brand fill so the row has a centre of
          gravity. */}
      <section className="relative overflow-hidden border-y border-ink-200/70 bg-sand-50">


        <div className="relative container-page py-20 lg:py-24">
          {/*
            The icon disc overhangs the card by 28px (half of its 56px). When
            the cards stack, the row gap has to clear that overhang or each
            disc lands on the card above it — hence the larger gap until the
            three-column layout takes over.
          */}
          <div className="grid gap-16 pt-8 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-3 lg:gap-8">
            {VALUE_PROPS.map(({ icon: Icon, title, body }, i) => {
              const inverted = i === 1;
              return (
                <div
                  key={title}
                  className={cn(
                    "reveal group relative rounded-panel border px-8 pt-14 pb-8",
                    "transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-1.5",
                    inverted
                      ? "border-white/25 bg-brand-900 text-white shadow-[0_24px_48px_-24px_rgb(20_76_65/0.75)] hover:border-white/40"
                      : "border-ink-300/60 bg-sand-100 text-ink-900 hover:border-brand-400/70 hover:shadow-card",
                  )}
                >
                  {/* Icon disc, half outside the card. */}
                  <span
                    className={cn(
                      "icon-tile icon-tile-xl absolute -top-7 left-8 text-white",
                      "shadow-[0_12px_26px_-12px_rgb(20_76_65/0.85)] transition-transform duration-500 ease-out-soft group-hover:scale-105",
                      inverted ? "bg-brand-500" : "bg-brand-600",
                    )}
                  >
                    <span
                      className="absolute inset-0 rounded-full ring-1 ring-white/25 ring-inset"
                      aria-hidden
                    />
                    <Icon className="relative size-6" strokeWidth={1.75} aria-hidden />
                  </span>

                  <h3
                    className={cn(
                      "font-display text-xl tracking-tight",
                      inverted && "text-white",
                    )}
                  >
                    {title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 text-[15px] leading-relaxed",
                      inverted ? "text-brand-100/85" : "text-ink-600",
                    )}
                  >
                    {body}
                  </p>

                  {/* Index chip, echoing the reference's pill. */}
                  <span
                    className={cn(
                      "mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.16em] uppercase",
                      inverted
                        ? "bg-white/10 text-white ring-1 ring-white/20 ring-inset"
                        : "bg-white text-ink-600 ring-1 ring-ink-200 ring-inset",
                    )}
                  >
                    <span
                      className="size-1.5 rounded-full bg-brand-400"
                      aria-hidden
                    />
                    0{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ about -------------------------------
          Asymmetric editorial composition: the photograph sits in an offset
          frame with a thin rule shifted behind it, and the type column is set
          on a narrow measure alongside.

          id="about-us" matches the anchor the original's own nav and footer
          link to, so /#about-us lands here. */}
      <section
        id="about-us"
        className="relative scroll-mt-24 overflow-hidden border-y border-ink-200/70 bg-sand-50"
      >


        <div className="relative container-page py-20 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            {/* ---- image ---- */}
            <div className="reveal group relative">
              {/* Tinted plate offset behind the photograph, top-right. */}
              <span
                className="pointer-events-none absolute -top-5 -right-5 hidden h-full w-full rounded-hero bg-brand-100/50 sm:block"
                aria-hidden
              />

              <div className="relative overflow-hidden rounded-hero shadow-pop ring-1 ring-ink-900/5">
                <div className="relative aspect-[1201/595] w-full">
                  <Image
                    src="/about-office.png"
                    alt="The ProLicense Florida office, with the company logo on the boardroom wall."
                    fill
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04]"
                  />
                </div>

                {/* Depth: light from the top, a soft settle at the bottom. */}
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgb(255 255 255 / 0.10) 0%, transparent 28%, rgb(17 29 35 / 0.16) 100%)",
                  }}
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 rounded-hero ring-1 ring-white/25 ring-inset"
                  aria-hidden
                />
              </div>
            </div>

            {/* ---- type column ---- */}
            <div className="reveal lg:pl-4">
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-brand-400" aria-hidden />
                Who we are
              </p>

              <h2 className="font-display text-[2.5rem] leading-[1.05] lg:text-[3.25rem]">
                About <span className="font-light text-brand-600">Us</span>
              </h2>

              <div className="mt-8 space-y-6 text-[17px] leading-[1.8] text-ink-600">
                <p>
                  <span className="font-medium text-ink-900">
                    Prolicense Florida
                  </span>{" "}
                  offers state-approved, 100% online licensing courses for
                  Florida real estate agents, community association managers
                  (CAM), and HOA/condo board members.
                </p>
                <p>
                  Our self-paced programs are designed to help students pass the
                  state exam on the first try. With expert support, exam prep
                  tools, and mobile-friendly access, we make it easy to start or
                  grow your real estate or CAM career from anywhere in Florida.
                </p>
              </div>

              {/* The original ends this section with a link to the courses —
                  there is no separate About page to send a visitor to. */}
              <ButtonLink href="/courses" variant="dark" className="mt-10">
                See our courses
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ reviews ----------------------------- */}
      {reviews.length ? (
        <Section className="bg-white">
          <SectionHeading
            eyebrow="Student reviews"
            title="What students say after they pass"
            action={
              <ButtonLink href="/reviews" variant="outline">
                Read all reviews
                <ArrowRight aria-hidden />
              </ButtonLink>
            }
          />
          <div className="grid gap-7 md:grid-cols-3">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="reveal relative flex flex-col rounded-panel border border-ink-200/70 bg-white p-8 shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span
                  className="absolute top-6 right-7 font-display text-6xl leading-none text-ink-100 select-none"
                  aria-hidden
                >
                  &rdquo;
                </span>
                <Stars rating={review.rating} />
                <blockquote className="relative mt-5 flex-1 text-[15px] leading-relaxed text-ink-600">
                  {review.body}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
                  <span className="icon-tile size-9 text-[11px] font-medium">
                    {(review.author?.full_name ?? "Verified student")
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink-900">
                      {review.author?.full_name ?? "Verified student"}
                    </span>
                    {review.course ? (
                      <span className="mt-0.5 block truncate text-xs text-ink-500">
                        {review.course.title}
                      </span>
                    ) : null}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {/* --------------------------- recent posts --------------------------- */}
      <RecentPosts posts={posts} />
    </>
  );
}
