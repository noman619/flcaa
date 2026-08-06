import { CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";

const BENEFITS = [
  "One login for every course you own — no more separate portals.",
  "Pick up exactly where you left off, on any device.",
  "Certificates and exam attempts stored in your account forever.",
  "Message your instructor directly from inside the course.",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Flat navy field — no wash, no grid. The type carries the panel. */}
      <aside className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <div className="relative flex h-full flex-col justify-center px-14 text-white">
          <p className="text-[11px] font-medium tracking-[0.2em] text-brand-300 uppercase">
            {SITE.shortName} Student Portal
          </p>
          <h2 className="mt-5 max-w-md font-display text-[2rem] leading-tight text-white">
            One account. Every course. No portal maze.
          </h2>
          <ul className="mt-9 space-y-4">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex gap-3 text-sm leading-relaxed text-ink-300"
              >
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-brand-400"
                  aria-hidden
                />
                {benefit}
              </li>
            ))}
          </ul>
          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {SITE.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl text-white">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-ink-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  );
}
