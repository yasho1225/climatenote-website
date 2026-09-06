/**
 * The Note mark — the product's signature glyph. It reads as a margin
 * annotation: a bracket in the left margin plus an underline that "marks" a
 * noticed detail. Deliberately not a literal sticky note. Inherits currentColor
 * so it adapts to light/dark and to any surface it sits on.
 */
export function NoteMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="30"
      viewBox="0 0 28 30"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* margin bracket */}
      <path
        d="M7 3 H4 V27 H7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the noticed detail: a marked word. Was at y=12, only 6 units above
          the underline below (y=18) in a 30-unit viewBox — at the icon's
          actual 28×30px render size that's 1-2px of real separation, so the
          two strokes visually fused into one illegible squiggle rather than
          reading as two distinct marks. Moved to y=9 for real breathing
          room. */}
      <path
        d="M11 9 H23"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* the annotation underline — a confident single swoosh, not a wobble.
          Moved to y=20/20.3 to pair with the line above, and given a deeper,
          more deliberate curve (was a ~1.6-unit dip, now ~2.5) so it reads as
          an intentional underline stroke rather than a stray tremor. */}
      <path
        d="M11 20 C14.5 17.7, 19.5 17.7, 23 20.3"
        stroke="var(--accent, currentColor)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
