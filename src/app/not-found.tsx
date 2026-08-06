import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { NAV_TRACKS } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl text-ink-200">404</p>
      <h1 className="mt-4 font-display text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-ink-500">
        The link may be out of date. Here is where most people are heading:
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/courses" variant="outline">
          Browse all courses
        </ButtonLink>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {NAV_TRACKS.map((track) => (
          <li key={track.slug}>
            <Link href={track.href} className="text-brand-600 hover:underline">
              {track.title}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/contact" className="text-brand-600 hover:underline">
            Contact us
          </Link>
        </li>
      </ul>
    </div>
  );
}
