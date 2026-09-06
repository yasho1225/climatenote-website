"use client";

import { motion, MotionConfig, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";
import type { Route } from "next";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrollToTarget } from "@/components/smooth-scroll-provider";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

/** A word-by-word fade reveal, triggered once when scrolled into view. Pure
 *  opacity — no rise/translate — so the words settle in place rather than
 *  visibly travelling up the screen. */
export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] text-[var(--accent)]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

/** Same reveal as WordsPullUp — opacity only, no rise — but each segment of
 *  text can carry its own className, for a headline that needs one phrase
 *  picked out in a different colour. */
export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- ClimateHero ---------------- */
export interface ClimateHeroProps {
  /** Small tracked label above the headline. */
  kicker?: string;
  /** The one big word (or short phrase) given the pull-up treatment. */
  headline?: string;
  /** Substring of `headline` to pick out in the accent colour — the hook's
   *  key phrase. Rendered plain (no colour split) if not found verbatim in
   *  `headline`, so a caller can still pass a custom headline safely. */
  headlineEmphasis?: string;
  /** Supporting paragraph beneath the headline. */
  description?: string;
  ctaLabel?: string;
  ctaHref?: Route | string;
  /** This week's category tag — set to null to hide the metadata row entirely. */
  topic?: string | null;
  /** e.g. "6 min read". */
  readingTime?: string;
  /** Real, licensable photography only — never a generated illustration.
   *  Pass `null` explicitly (not just omit the prop) to render the flat,
   *  photo-less fallback — e.g. before the first note is published. Omitting
   *  it entirely falls back to the demo photo, for standalone/preview use. */
  imageUrl?: string | null;
  imageAlt?: string;
}

/**
 * The site's homepage hero: a full-bleed, centred editorial-poster — one
 * enormous word-by-word headline over a real photograph, no nav of its own
 * (the site already has one — a second, competing nav was an earlier
 * version's biggest flaw), everything stacked and centred like a printed
 * cover, not a product page.
 *
 * Framer-motion based rather than GSAP: it's simple enough (opacity/y
 * entrances, no scroll-linked scrubbing) that GSAP's ScrollTrigger machinery
 * would be pure overhead here, and staying framer-motion keeps this
 * component usable as a standalone `ui/` primitive too — see
 * `app/preview/climate-hero` for it rendered with its own demo defaults
 * rather than live article data. The one continuous motion — the
 * background's slow zoom — is deliberately plain CSS, not a JS-driven loop:
 * a JS `repeat: -1` tween turned out not to reliably tick in this project's
 * production build, and a CSS `@keyframes` doesn't have that failure mode.
 */
export function ClimateHero({
  kicker = "The Climate Note — a weekly dispatch",
  headline = "The climate, one week at a time.",
  headlineEmphasis = "one week",
  description = "One overlooked climate story a week — explained clearly, with one small action attached.",
  ctaLabel = "Read this week’s note",
  ctaHref = "/articles",
  topic = "Oceans",
  readingTime = "6 min read",
  imageUrl = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1200&fit=crop&crop=entropy&q=80",
  imageAlt = "A dark, misty pine forest with a beam of light breaking through the canopy",
}: ClimateHeroProps) {
  const ctaLinkRef = useRef<HTMLDivElement | null>(null);

  // Magnetic CTA (desktop + fine pointer only) — the one deliberate GSAP
  // touch in an otherwise framer-motion component, reusing the exact
  // pull/duration/ease already proven on the production hero
  // (components/home/home-hero.tsx) rather than inventing new values.
  // Skipped entirely on touch devices, where there's no cursor to react to
  // and the effect would just be dead code running for nothing.
  useEffect(() => {
    const el = ctaLinkRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const pull = 0.32;

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * pull);
      yTo((event.clientY - (rect.top + rect.height / 2)) * pull);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    // `reducedMotion="user"` neutralises every nested framer-motion animation
    // (transform-based ones become instant; opacity fades still complete)
    // whenever `prefers-reduced-motion` is on — the one thing this
    // framer-motion-based component needed to actually match the rest of
    // the site, which handles this explicitly everywhere else via GSAP's
    // own matchMedia checks.
    <MotionConfig reducedMotion="user">
    <section
      // Pulled up under the site's sticky 72px header so the hero fills the
      // true viewport height instead of being pushed down by it — same
      // technique the production hero (components/home/home-hero.tsx) uses.
      className="relative -mt-[calc(72px+env(safe-area-inset-top))] h-[100svh] w-full overflow-hidden bg-[var(--pine)]"
      aria-labelledby="climate-hero-title"
    >
      {/* Scoped, not global — this keeps the component a true drop-in
          primitive that doesn't require touching the app's globals.css. */}
      <style>{`
        /* Scale starts above 1 (not 1) because the photo is blurred:
           filter: blur() samples past the element's own edge, and a blurred
           image sized to exactly fill its box shows a faint soft fringe at
           the boundary. Oversizing by 3.5% — less than before, now that the
           blur itself is lighter — keeps that fringe permanently outside the
           viewport. */
        @keyframes climate-hero-kenburns {
          from { transform: scale(1.035); }
          to { transform: scale(1.11); }
        }

        /* The fluid field: the same drifting-blob technique used on the
           production homepage hero (components/home/home-hero.tsx),
           reproduced here rather than shared, since this component is meant
           to stay a self-contained drop-in primitive. Three soft colour
           masses on long, mismatched cycles (30s/42s/54s) so the loop never
           repeats on a noticeable beat — it reads as the surface breathing,
           not as decoration on a timer. Blended over the now-abstracted,
           heavily blurred photograph with soft-light blending so it tints
           the existing image rather than sitting on top of it as a
           separate layer. */
        .clh-field { position: absolute; inset: 0; overflow: hidden; }
        .clh-blob {
          position: absolute;
          aspect-ratio: 1;
          border-radius: 9999px;
          mix-blend-mode: soft-light;
          will-change: transform;
        }
        .clh-blob--a {
          left: -20%; top: -22%; width: 65%;
          filter: blur(60px);
          background: radial-gradient(circle, rgba(52,107,79,0.9), transparent 68%);
          animation: clh-drift-a 30s ease-in-out infinite;
        }
        .clh-blob--b {
          right: -18%; bottom: -26%; width: 58%;
          filter: blur(70px);
          background: radial-gradient(circle, rgba(70,134,101,0.7), transparent 68%);
          animation: clh-drift-b 42s ease-in-out infinite;
        }
        .clh-blob--c {
          left: 30%; top: 30%; width: 42%;
          filter: blur(80px);
          background: radial-gradient(circle, rgba(216,169,64,0.3), transparent 68%);
          animation: clh-drift-c 54s ease-in-out infinite;
        }
        @keyframes clh-drift-a {
          0%, 100% { transform: translate3d(-6%, -5%, 0) scale(1); }
          50%      { transform: translate3d(6%, 5%, 0) scale(1.18); }
        }
        @keyframes clh-drift-b {
          0%, 100% { transform: translate3d(7%, 6%, 0) scale(1.1); }
          50%      { transform: translate3d(-7%, -6%, 0) scale(0.95); }
        }
        @keyframes clh-drift-c {
          0%, 100% { transform: translate3d(-5%, 8%, 0) scale(0.98); }
          50%      { transform: translate3d(8%, -6%, 0) scale(1.14); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clh-blob { animation: none; }
        }
      `}</style>

      {/* Real, openly-licensed photography — never a generated illustration.
          Absent (not a fallback stock photo) before the first note is
          published — the fluid field beneath still carries the section on
          its own. Blurred and pushed further back in the composition: the
          type is the subject now, and the photo is the mood behind it rather
          than something meant to be read in its own right. The slow zoom is
          purely decorative and disabled under reduced motion; it never
          affects layout, only its own transform. */}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt}
          // `scale-[1.035]` is the reduced-motion fallback for the same edge
          // guard the keyframes provide: `motion-reduce:animate-none` removes
          // the animation entirely, which would otherwise drop the element
          // back to scale(1) — exactly the size where the blurred edge fringe
          // becomes visible — for the one group of users most likely to be
          // looking at a static frame. Blur brought down from 14px to 7px:
          // the first pass read as too heavy, closer to a flat colour wash
          // than a photograph.
          className="absolute inset-0 size-full origin-center scale-[1.035] object-cover blur-[7px] [animation:climate-hero-kenburns_22s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
        />
      )}

      <div className="clh-field" aria-hidden="true">
        <div className="clh-blob clh-blob--a" />
        <div className="clh-blob clh-blob--b" />
        <div className="clh-blob clh-blob--c" />
      </div>

      {/* Colour grade: a horizontal band, dark through the middle third
          where the text sits, lighter above and below — not a radial
          vignette. The cover photo changes weekly and its brightest point
          can land anywhere in frame; a radial vignette (dark edges, light
          centre) would darken everywhere except wherever that happens to be.
          A band guarantees legibility regardless of where the light falls. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,10,0.35)_0%,rgba(10,14,10,0.72)_32%,rgba(10,14,10,0.78)_68%,rgba(10,14,10,0.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_center,rgba(10,14,10,0.35)_0%,transparent_70%)]" />

      {/* Hero content — centred, stacked, like a printed cover rather than
          a product page. No nav here: the site already has one, and a
          second, floating one only ever collided with it.
          --accent is pinned bright here (not the light-mode brand green):
          this sits on a dark photo scrim regardless of site theme, same
          reasoning as the production hero.
          `justify-end` (not `justify-center`): dead-centre reads as
          floating/adrift on a full 100svh section — a poster's type block
          sits in the lower two-thirds of the frame, anchored to something,
          not centred in empty space. Horizontal centring is unchanged.
          Bottom padding's floor (6rem) is deliberately taller than it looks
          like it needs to be: the absolutely-positioned scroll cue below
          occupies roughly the bottom 32–86px of the section on its own, and
          a smaller floor here let this block's last line land inside that
          span at narrow viewport heights. */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-[clamp(6rem,10vh,7.5rem)] text-center [--accent:#8fd1a8] [--accent-bright:#9bd4b7] [--on-accent:#12130f]"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-note text-[11px] uppercase tracking-[0.22em] text-white/65 sm:text-xs"
        >
          {kicker}
        </motion.p>

        <h1
          id="climate-hero-title"
          // Sized and width-capped for a five-word sentence rather than a
          // single word: the 8.5rem clamp only worked when the headline was
          // "Notice" alone. `WordsPullUp` flex-wraps by individual word, so a
          // centred max-width is what actually shapes the line breaks. 20ch
          // measured wider than its name suggests at this weight and broke
          // after "a" — stranding "time." alone on its own line; 16ch breaks
          // cleanly after "week" instead: "The climate, one week" / "at a
          // time." — the same split the production hero uses for this exact
          // sentence.
          //
          // Weight pushed from 650 to 800: at a hero-poster size, 650 read as
          // safe rather than as a hook — a headline this size needs to
          // commit, and 800 is the weight that actually looks intentional at
          // 6rem+ rather than merely "thick regular." Tracking tightened to
          // match (heavier weights need slightly tighter tracking to avoid
          // looking loose).
          className="mt-5 max-w-[16ch] font-[family-name:var(--display)] font-[800] leading-[0.96] tracking-[-0.045em] text-balance text-white text-[clamp(2.75rem,4.6vw+1.5rem,6.25rem)] [text-shadow:0_4px_32px_rgba(0,0,0,0.45)]"
        >
          {/* No trailing asterisk here: that mark was designed to punctuate
              a single evocative word ("Notice*"), and on a full sentence
              ending in its own period it would land on "time.*" and read as
              a typo rather than an editorial flourish. */}
          {(() => {
            const cut = headlineEmphasis ? headline.indexOf(headlineEmphasis) : -1;
            if (cut === -1) return <WordsPullUp text={headline} className="justify-center" />;
            const before = headline.slice(0, cut).trim();
            const after = headline.slice(cut + headlineEmphasis.length).trim();
            return (
              <WordsPullUpMultiStyle
                segments={[
                  ...(before ? [{ text: before }] : []),
                  { text: headlineEmphasis, className: "text-[var(--accent)]" },
                  ...(after ? [{ text: after }] : []),
                ]}
              />
            );
          })()}
        </h1>

        {/* No subline: the headline's own sentence already carries the
            argument ("one week at a time"), so a second tagline underneath
            it was competing for the same point rather than adding one — the
            hero reads cleaner as headline, then supporting detail, then
            action, without an extra beat between the two. Description sized
            up from text-sm to close to body-copy size (it now sits directly
            under the headline, not under a second line of text) and given a
            proportionally larger gap to match — mirrors the headline →
            description spacing already established on the site's other
            hero pattern (components/home/home-hero.tsx). */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-[40ch] text-base leading-relaxed text-white/80 sm:text-lg"
        >
          {description}
        </motion.p>

        {/* The ref sits on this wrapper, not on the `next-view-transitions`
            `Link` inside it: that Link is a plain function component (not
            `forwardRef`-wrapped), so a ref passed straight to it depends on
            React 19's newer implicit ref-forwarding rather than an
            established, guaranteed API. Moving GSAP's magnetic pull one
            level up sidesteps that fragility entirely — the wrapper is a
            tight inline-block around the button, so pulling it toward the
            cursor reads identically to pulling the button itself. */}
        <motion.div
          ref={ctaLinkRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 inline-block"
        >
          <Link
            href={ctaHref as Route}
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] py-1 pl-5 pr-1 font-note text-sm text-[var(--on-accent)] transition-all hover:gap-3 hover:bg-[var(--accent-bright)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {ctaLabel}
            <span className="flex size-9 items-center justify-center rounded-full bg-black/85 transition-transform group-hover:scale-110 sm:size-10">
              <ArrowRight aria-hidden="true" className="size-4 text-white" />
            </span>
          </Link>
        </motion.div>

        {/* The "stuff" beneath the CTA: real context, not just a poster
            headline — matches the production hero's pattern of grounding
            the hero in an actual issue rather than pure marketing copy. */}
        {topic && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-4 font-note text-xs text-white/50"
          >
            {topic}
            {readingTime ? ` · ${readingTime}` : ""}
          </motion.p>
        )}
      </div>

      {/* Scroll cue — layout-driven signature already established by the
          production hero, reused here in its centred form. Was purely
          decorative (`aria-hidden`, `pointer-events-none`); now a real
          button that smooth-scrolls one viewport down through the shared
          Lenis instance, so it does what it visually promises rather than
          just sitting there implying it. Scrolls by a fixed viewport height
          rather than to a specific section: this component is a standalone
          `ui/` primitive that doesn't know what follows it wherever it's
          used, and "scroll one screen down" is the one behaviour that's
          always correct regardless of caller. */}
      <motion.button
        type="button"
        onClick={() => scrollToTarget(window.scrollY + window.innerHeight)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="group absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label="Scroll to the next section"
      >
        <span className="font-note text-[10px] uppercase tracking-[0.24em] text-white/50 transition-colors group-hover:text-white/80">
          Scroll
        </span>
        <span className="h-8 w-px bg-white/35 transition-colors group-hover:bg-white/60" />
      </motion.button>
    </section>
    </MotionConfig>
  );
}
