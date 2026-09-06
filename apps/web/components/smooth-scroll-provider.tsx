"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Module-level, not context: this is the one Lenis instance for the whole
// page, owned entirely by SmoothScrollProvider below. Exposing a plain
// function to call it lets any component request a smooth scroll — a hero's
// scroll cue, an anchor link — without prop-drilling the instance or
// standing up a context whose only consumer is "click this, scroll there."
let activeLenis: import("lenis").default | null = null;

/**
 * Smoothly scrolls to a target, in sync with the rest of the page's motion.
 * Routes through the live Lenis instance when one exists so it shares Lenis'
 * own easing/duration rather than fighting it with a second, native smooth
 * scroll running at the same time. Falls back to the browser's native smooth
 * scroll — under `prefers-reduced-motion` (where Lenis is never constructed)
 * or before Lenis has finished its dynamic import — so the action always
 * does *something* rather than silently no-op'ing.
 */
export function scrollToTarget(target: string | number | HTMLElement) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}

/**
 * The site's scroll foundation. Renders nothing — Lenis operates on
 * `window` directly (no wrapper/content options), so there's no DOM to
 * wrap children in and therefore nothing that can remount the tree when
 * this turns smoothing on or off.
 *
 * Wires Lenis' RAF loop into GSAP's ticker and keeps ScrollTrigger's cached
 * positions in sync with it — the one integration detail that's easy to
 * get wrong (skip it and every scrub/pin drifts out of alignment with the
 * actual scroll position).
 *
 * Under `prefers-reduced-motion`, Lenis is never constructed at all —
 * scrolling stays fully native, not "less smooth."
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | undefined;
    let tick: ((time: number) => void) | undefined;
    let cancelled = false;

    // Loaded dynamically so the (larger) Lenis module never ships to
    // reduced-motion users and never blocks first paint for anyone else.
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        // Kept intentionally responsive: low enough that the page never
        // feels detached from the wheel/trackpad. Touch stays native —
        // simulated touch-smoothing is what makes mobile scrolling feel
        // artificial rather than premium.
        wheelMultiplier: 1,
        touchMultiplier: 1,
      });

      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();
      activeLenis = lenis;
    });

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      activeLenis = null;
    };
  }, []);

  return null;
}
