import Image from "next/image";

export type CoursePerk = {
  /** The original's own line art, hence an image not an icon font. */
  icon: string;
  text: string;
};

/**
 * The four-up "what you get" run the two board pages carry.
 *
 * Shared rather than copied so the certification and continuing education
 * pages cannot drift apart — only the copy differs between them.
 */
export function CoursePerks({
  perks,
  className,
}: {
  perks: readonly CoursePerk[];
  /** Layout hook for the band each page drops this into. */
  className?: string;
}) {
  return (
    <ul
      className={`reveal mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 ${className ?? ""}`}
    >
      {perks.map((perk) => (
        <li
          key={perk.text}
          className="flex items-start gap-4 rounded-card border border-white/70 bg-white/70 p-5 transition-colors duration-300 hover:bg-white"
        >
          <Image
            src={perk.icon}
            alt=""
            width={100}
            height={100}
            className="size-10 shrink-0 object-contain"
          />
          <span className="text-[15px] leading-relaxed text-ink-700">
            {perk.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
