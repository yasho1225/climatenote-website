"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in ms. */
  delay?: number;
  /** Vertical travel, in px. */
  shift?: number;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "style">;

/**
 * Reveals children once on scroll-in — the site's one section-level motion
 * language, used everywhere below the hero (archive rows, page intros, the
 * loop). GSAP + ScrollTrigger under the hood so it shares a timing/easing
 * vocabulary with the hero rather than running on a separate CSS-transition
 * system, but the props are unchanged so every existing call site is
 * unaffected.
 *
 * Wrapped in `gsap.matchMedia`'s reduced-motion query: under
 * `prefers-reduced-motion`, the tween is simply never created, so content
 * renders in its natural (fully visible) DOM state — nothing depends on JS
 * completing to be readable.
 */
export function Reveal({ children, as, delay = 0, shift = 22, className, ...rest }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        node,
        { y: shift, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [delay, shift]);

  return (
    <Tag {...rest} ref={ref} className={className}>
      {children}
    </Tag>
  );
}
