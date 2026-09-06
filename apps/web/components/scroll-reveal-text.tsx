"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type ScrollRevealTextProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Opacity of not-yet-revealed words. Low enough to read as "dimmed", not gone. */
  baseOpacity?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * A second, deliberately different motion language from `Reveal`: instead of
 * the whole block fading up once as it enters the viewport, each word starts
 * dim and sharpens individually as the reader scrolls past — tied directly
 * to scroll position (`scrub`), not a one-shot trigger. The words are always
 * present and readable at every opacity; nothing here depends on JS to
 * become legible, and under reduced motion the whole block simply renders at
 * full opacity from the start (see the matchMedia branch below).
 *
 * The pattern (SplitText into words, scrub their opacity across a scroll
 * range) is the well-known React Bits "ScrollReveal" text effect, reimplemented
 * directly against this site's own GSAP setup rather than pulled in as a
 * dependency — it's a few lines of GSAP, not enough surface area to justify a
 * package for it, and doing it directly means it shares the exact same
 * ScrollTrigger/Lenis wiring as everything else on the page.
 *
 * Only ever used on plain-text blocks. A node with its own nested,
 * absolutely-positioned children (e.g. `MarkedPhrase`'s self-drawing
 * underline SVG) should not be split this way — SplitText rewrites the
 * DOM structure it's applied to, which can dislocate a child that depends on
 * being positioned exactly relative to its original parent span.
 */
export function ScrollRevealText({
  children,
  as = "p",
  className,
  baseOpacity = 0.18,
  ...rest
}: ScrollRevealTextProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const mm = gsap.matchMedia();

    mm.add(
      { motionOk: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { motionOk } = context.conditions as { motionOk: boolean };

        if (!motionOk) {
          gsap.set(node, { opacity: 1 });
          return;
        }

        const split = new SplitText(node, { type: "words" });
        gsap.set(split.words, { opacity: baseOpacity });

        const tween = gsap.to(split.words, {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            // Finishes well before the block leaves the viewport (85%→35%,
            // not 85%→0%) — the reveal should complete while there's still
            // time to read the words at full opacity, not resolve right as
            // they're scrolling out of view.
            start: "top 85%",
            end: "top 35%",
            scrub: 0.4,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          split.revert();
        };
      },
    );

    return () => mm.revert();
  }, [baseOpacity]);

  return (
    <Tag {...rest} ref={ref} className={className}>
      {children}
    </Tag>
  );
}
