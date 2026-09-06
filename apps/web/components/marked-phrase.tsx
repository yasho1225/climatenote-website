"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./marked-phrase.module.css";

type MarkedPhraseProps = {
  children: ReactNode;
  /** Draw the underline on mount (hero) vs. only when scrolled into view. */
  immediate?: boolean;
  delay?: number;
  variant?: "underline" | "highlight";
};

/**
 * "Marks" a phrase the way a reader annotates a noticed detail — a loose
 * hand-drawn underline that draws itself in. The stroke is a single quadratic
 * path so it reads as ink, not a rule. Under reduced motion the mark is simply
 * present, undrawn-animation.
 */
export function MarkedPhrase({ children, immediate = false, delay = 240, variant = "underline" }: MarkedPhraseProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [drawn, setDrawn] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  if (variant === "highlight") {
    return (
      <span ref={ref} className={styles.highlight}>
        {children}
      </span>
    );
  }

  return (
    <span ref={ref} className={styles.mark}>
      {children}
      <svg
        className={`${styles.underline} ${drawn ? styles.draw : ""}`}
        viewBox="0 0 320 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ "--mark-delay": `${delay}ms` } as React.CSSProperties}
      >
        <path d="M4 16 C 60 8, 120 22, 180 14 S 280 8, 316 15" />
      </svg>
    </span>
  );
}
