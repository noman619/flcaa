import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/** Intrinsic size of the supplied artwork — keeps the aspect ratio exact. */
const LOGO = { src: "/logo-prolicense.png", width: 384, height: 124 };

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex shrink-0 items-center transition-opacity duration-300 ease-out-soft hover:opacity-85",
        className,
      )}
      aria-label={`${SITE.name} home`}
    >
      <Image
        src={LOGO.src}
        alt={SITE.name}
        width={LOGO.width}
        height={LOGO.height}
        priority
        className={cn(
          "h-9 w-auto lg:h-10",
          // The artwork is navy and red on transparent, so it disappears on the
          // dark footer. Flattening it to white keeps the wordmark legible
          // there without needing a second asset.
          inverted && "brightness-0 invert",
        )}
      />
    </Link>
  );
}
