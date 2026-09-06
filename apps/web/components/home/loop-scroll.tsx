"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type LoopStepData = {
  index: number;
  label: string;
  /** Our editorial promise for this step — short, and never a claim we can't keep. */
  promise: string;
  /** The same step shown with this week's real note. Null when there is no note. */
  evidence: string | null;
  noteTitle?: string | null;
};

/**
 * The product loop as one continuous scroll, not three stacked pages. On
 * desktop, the step marker stays in view (CSS `position: sticky` — cheap,
 * compositor-only, and doesn't fight the page's own layout the way a JS
 * pin inside a CSS Grid can) while the steps scroll past beside it. A
 * single ScrollTrigger tracks progress across that same span to drive the
 * rail fill and the big number that crossfades as the active step changes.
 *
 * On mobile there's no side column at all, so it falls back to plain
 * per-step scroll triggers that just drive the same dimming. Under reduced
 * motion, nothing dims — every step renders at full opacity, in document
 * order, exactly as written.
 */
export function LoopScroll({ steps }: { steps: LoopStepData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const railFillRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLParagraphElement | null>(null);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        trackable: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { trackable } = context.conditions as { trackable: boolean };

        if (trackable) {
          const st = ScrollTrigger.create({
            trigger: gridRef.current,
            start: "top top+=88",
            end: "bottom bottom",
            onUpdate(self) {
              const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
              setActiveIndex((prev) => (prev === i ? prev : i));
              gsap.set(railFillRef.current, { height: `${self.progress * 100}%` });
            },
          });
          return () => st.kill();
        }

        // Mobile: per-step triggers to drive the same dimming.
        const triggers = steps.map((_, i) => {
          const node = stepRefs.current[i];
          if (!node) return null;
          return ScrollTrigger.create({
            trigger: node,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => self.isActive && setActiveIndex(i),
          });
        });
        return () => triggers.forEach((t) => t?.kill());
      },
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  // The pinned number's own small crossfade whenever the active step changes
  // — independent of the scrub above, so it always plays a clean beat
  // rather than being tied to per-frame scroll progress.
  useLayoutEffect(() => {
    if (!numberRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      numberRef.current,
      { yPercent: 35, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
    );
  }, [activeIndex]);

  const activeStep = steps[activeIndex];

  return (
    <section aria-label="How The Climate Note works: learn, notice, act" className="border-t border-line">
      <div
        ref={gridRef}
        className="mx-auto grid w-[min(var(--w-wide),100%-2*var(--gutter))] gap-x-[clamp(2rem,5vw,5rem)] py-[clamp(3.5rem,8vw,6.5rem)] md:grid-cols-[8rem_1fr]"
      >
        <div className="relative hidden md:block" aria-hidden="true">
          <div className="sticky top-[calc(88px+2vh)] w-32 pt-1">
            <p ref={numberRef} className="font-note text-5xl leading-none text-accent">
              {String(activeStep.index).padStart(2, "0")}
            </p>
            <p className="mt-3 font-note text-xs uppercase tracking-[0.22em] text-ink-3">
              {activeStep.label}
            </p>
            <div className="relative mt-6 h-[38vh] w-px bg-line-strong">
              <div ref={railFillRef} className="absolute inset-x-0 top-0 w-px bg-accent" style={{ height: 0 }} />
            </div>
          </div>
        </div>

        <ol className="flex list-none flex-col gap-[clamp(3rem,9vw,5.5rem)]">
          {steps.map((step, i) => {
            const active = i === activeIndex;
            return (
              <li
                key={step.index}
                ref={(node) => {
                  stepRefs.current[i] = node;
                }}
                className={`transition-[opacity,filter] duration-500 ease-out ${active ? "" : "md:opacity-45 md:blur-[0.4px]"}`}
              >
                <p
                  className="font-note text-xs uppercase tracking-[0.22em] transition-colors duration-300"
                  style={{ color: active ? "var(--accent)" : "var(--ink-3)" }}
                >
                  {String(step.index).padStart(2, "0")} · {step.label}
                </p>

                <p className="mt-3 max-w-[30ch] text-[clamp(1.5rem,1.05rem+1.7vw,2.35rem)] font-[600] leading-[1.14] tracking-tight text-balance text-ink">
                  {step.promise}
                </p>

                {step.evidence && (
                  <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-ink-3">
                    {step.evidence}
                    {step.noteTitle ? (
                      <span className="text-ink-3/70"> — {step.noteTitle}</span>
                    ) : null}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
