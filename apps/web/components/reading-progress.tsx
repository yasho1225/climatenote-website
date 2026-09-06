"use client";

import { useEffect, useRef } from "react";
import styles from "./reading-progress.module.css";

/**
 * A slim reading-progress bar pinned to the top of the viewport. Reads scroll
 * geometry inside a rAF (never during React render) and writes a single CSS
 * variable, so it stays cheap. Purely decorative — hidden from assistive tech.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      ref.current?.style.setProperty("--progress", String(progress));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={ref} className={styles.bar} />
    </div>
  );
}
