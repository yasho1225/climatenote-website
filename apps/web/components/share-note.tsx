"use client";

import { useState } from "react";
import styles from "./share-note.module.css";

/**
 * A user-initiated share control. Uses the native Web Share sheet where
 * available (mobile), and otherwise copies the link and confirms via an
 * aria-live region. Never shares anything without an explicit click.
 */
export function ShareNote({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The user dismissed the share sheet, or clipboard was blocked — no-op.
    }
  };

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.button} onClick={onShare}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path
            d="M7.5 1.5V9.5M7.5 1.5L4.8 4.2M7.5 1.5L10.2 4.2M2.5 8v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Share
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
