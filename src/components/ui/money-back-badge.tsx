import Image from "next/image";

/**
 * "30 Day Money Back Guarantee" seal — the artwork used on the original site.
 *
 * `days` is accepted but only 30 has artwork; anything else falls back to text
 * so the badge can never promise a window the refund policy does not offer.
 */
export function MoneyBackBadge({
  days = 30,
  className,
}: {
  days?: number;
  className?: string;
}) {
  if (days !== 30) {
    return (
      <p
        className={`inline-flex items-center rounded-full bg-ink-950 px-4 py-2 text-xs font-medium tracking-[0.14em] text-white uppercase ${className ?? ""}`}
      >
        {days}-day money back guarantee
      </p>
    );
  }

  return (
    <Image
      src="/course/money-back-30day.png"
      alt="30 day money back guarantee"
      width={984}
      height={299}
      className={`h-auto w-52 ${className ?? ""}`}
    />
  );
}
