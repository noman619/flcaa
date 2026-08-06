import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/env";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/**
 * One typeface for the entire product. A geometric grotesque reads modern and
 * restrained at display sizes while staying legible at 13px in the dashboard
 * tables and forms — which a display serif does not. Nothing above 500 is
 * loaded, because nothing on the site is allowed to be heavier than that.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — Florida Real Estate, CAM & Board Member Courses`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  keywords: [
    "Florida real estate license",
    "63 hour real estate course",
    "CAM license Florida",
    "community association manager course",
    "HOA board certification Florida",
    "Florida real estate continuing education",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.name} — Florida Licensing Courses`,
    description: SITE.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1f4074",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * suppressHydrationWarning on <html> and <body> only:
     *
     * Extensions (password managers, Grammarly, dark-mode forcers, Google
     * Translate) stamp attributes onto these two elements before React
     * hydrates, which React then reports as a mismatch it "won't patch up".
     * The flag is one level deep — it silences those two elements' own
     * attributes and nothing inside them, so a real mismatch in the app still
     * surfaces.
     */
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-white" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only rounded-lg focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <CartProvider>
          <ScrollReveal />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
