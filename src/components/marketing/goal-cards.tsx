import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type Goal = {
  title: string;
  blurb: string;
  href: string;
  image: string;
  alt: string;
};

/**
 * "Select Your Goal" — the school pages' way in.
 *
 * A visitor arriving on a school page knows what they want to achieve, not
 * which product achieves it, so the cards are named after the outcome and the
 * course is what they land on. Whole card is the target; the arrow is an
 * affordance, not a second link.
 */
export function GoalCards({
  title,
  goals,
}: {
  title: string;
  goals: readonly Goal[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <h2 className="reveal font-display text-[1.8rem] leading-tight text-gold-600 lg:text-[2.35rem]">
          {title}
        </h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {goals.map((goal) => (
            <li key={goal.title}>
              <Link
                href={goal.href}
                className="group reveal flex h-full flex-col overflow-hidden rounded-panel border border-ink-200/60 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between gap-3 bg-brand-900 px-5 py-4">
                  <h3 className="font-display text-[1.05rem] leading-snug text-white">
                    {goal.title}
                  </h3>
                  <ArrowRight
                    className="size-4 shrink-0 text-white/50 transition-[transform,color] duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-white"
                    aria-hidden
                  />
                </div>

                <p className="bg-sand-100 px-5 py-5 text-[14.5px] leading-relaxed text-ink-700">
                  {goal.blurb}
                </p>

                <div className="relative mt-auto aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={goal.image}
                    alt={goal.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
