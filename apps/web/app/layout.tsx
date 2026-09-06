import type { Metadata, Viewport } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

// The primary interface/body face — modern, confident, does the heavy
// lifting for nav, body copy, and every heading including the hero. A
// deliberate two-voice system: this for reading, mono for labels/meta —
// no separate "editorial" display face competing for personality.
const sans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// The one remaining serif: reserved for the article "dek" only.
const reading = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-reading",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "The Climate Note",
    template: "%s — The Climate Note",
  },
  description:
    "A weekly climate note for young readers: understand one thing, notice it in your day, act on it.",
  applicationName: "The Climate Note",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#121915" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Route changes use the browser's View Transitions API (via
    // next-view-transitions, since the native React <ViewTransition>
    // component in Next's own docs requires a canary React build this
    // project doesn't run) so navigating between pages crossfades instead of
    // hard-cutting. SiteHeader and SiteFooter sit outside {children}, so they
    // never enter the transitioning region and stay static across every
    // navigation without any extra "anchoring" work.
    <ViewTransitions>
      <html lang="en" className={`${sans.variable} ${reading.variable} ${mono.variable}`}>
        <body suppressHydrationWarning>
          <SmoothScrollProvider />
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
        </body>
      </html>
    </ViewTransitions>
  );
}
