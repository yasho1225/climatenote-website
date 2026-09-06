"use client";

import { Link } from "next-view-transitions";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export type HeroFeature = {
  slug: string;
  title: string;
  topic: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  readingMinutes: number;
  dateLabel: string | null;
};

/**
 * The opening statement, built as a split editorial cover rather than the
 * usual full-bleed photograph with type laid over it.
 *
 * That earlier arrangement had two problems that no amount of restyling
 * fixes: the photo needed three stacked gradient scrims to make white text
 * legible (so the photo was always half-destroyed), and the headline still
 * had to stay small enough to survive whatever landed behind it. Separating
 * the two surfaces solves both at once — the type sits on flat --pine, where
 * contrast is a constant and it can run much larger and heavier, and the
 * photograph is shown undimmed.
 *
 * It also changes what the hero *means*. The image is this week's note's
 * cover, so here it is presented as the note — captioned with the real
 * title, topic and reading time — instead of being borrowed as wallpaper.
 *
 * Motion stays scoped to a few deliberate moments rather than scattered
 * everywhere: an entrance choreography on load, a small scroll-linked depth
 * effect while the hero is in view, and a hand-off as it leaves. Everything
 * is readable with JavaScript off or `prefers-reduced-motion` on — GSAP only
 * animates elements already visible in the server-rendered HTML.
 */
export function HomeHero({
  feature,
  issueLabel,
}: {
  feature: HeroFeature | null;
  issueLabel: string;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  // The wrapper around the <img>, not the image itself: GSAP drives this one
  // and the CSS push drives the image, because a CSS animation's transform
  // permanently overrides an inline one.
  const bgImgRef = useRef<HTMLDivElement | null>(null);
  const darkenRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const ctaLinkRef = useRef<HTMLAnchorElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);

  const hasCover = Boolean(feature?.coverUrl);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          reduceMotion: boolean;
        };

        // The photo panel, its image and its caption only exist when there is
        // a published note with a cover — so every target below is optional.
        // GSAP merely warns on a single null target but throws outright on an
        // array containing one, so nulls are filtered before anything is
        // handed to it, and empty target lists are skipped entirely.
        const targets = (...refs: Array<Element | null>) => refs.filter((el): el is Element => el !== null);

        const set = (refs: Array<Element | null>, vars: gsap.TweenVars) => {
          const found = targets(...refs);
          if (found.length) gsap.set(found, vars);
        };

        const settle = () => {
          set([kickerRef.current, subRef.current, ctaRef.current, cueRef.current, headlineRef.current], {
            opacity: 1,
            y: 0,
          });
          set([curtainRef.current], { scaleY: 0 });
          set([panelRef.current], { clipPath: "inset(0% 0% 0% 0%)" });
          set([bgImgRef.current, captionRef.current], { scale: 1, opacity: 1, y: 0 });
        };

        if (reduceMotion) {
          settle();
          return;
        }

        // --- 1. Entrance choreography ------------------------------------
        // Opens on a curtain wipe — the one properly "big" move in the
        // sequence — which clears the way for the panel reveal and the
        // headline underneath it.
        gsap.set(curtainRef.current, { transformOrigin: "top" });

        // Safety net, independent of everything below: guarantees the hero is
        // fully visible within 3s no matter what — e.g. a background or
        // throttled tab where rAF-driven work is deprioritised. Redundant
        // (and harmless) if the real entrance already played; it only
        // re-asserts the same end state.
        const safety = gsap.delayedCall(3, settle);

        // No `autoSplit`, so `onSplit` fires exactly once per instance — no
        // "has this already played" guard needed. Deliberately not returning
        // the timeline: SplitText auto-kills any tween/timeline returned from
        // `onSplit` the moment `.revert()` is called, which happens on every
        // cleanup (including React Strict Mode's dev-only double-invoke) —
        // that silently killed the entrance before it ever played. GSAP's own
        // overwrite handling keeps this safe on the double-invoke: a stray
        // first-pass timeline targeting the same properties is auto-cancelled
        // when the second pass's tweens are created.
        const split = new SplitText(headlineRef.current, {
          type: "lines",
          mask: "lines",
          onSplit(self) {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.to(curtainRef.current, { scaleY: 0, duration: 0.75, ease: "power4.inOut" }, 0)
              .fromTo(kickerRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.55)
              .fromTo(
                self.lines,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: "power4.out" },
                0.68,
              )
              .fromTo(subRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 1.12)
              .fromTo(ctaRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 1.32)
              .fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.7);

            // The photograph is uncovered by a downward wipe from its own top
            // edge — the same direction the curtain just travelled, so the two
            // moves read as one gesture rather than two. Absent when there is
            // no published note to show.
            if (panelRef.current && bgImgRef.current) {
              tl.fromTo(
                panelRef.current,
                { clipPath: "inset(0% 0% 100% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power3.inOut" },
                0.42,
              ).fromTo(bgImgRef.current, { scale: 1.14 }, { scale: 1, duration: 1.9, ease: "power2.out" }, 0.42);
            }
            if (captionRef.current) {
              tl.fromTo(captionRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.46);
            }
          },
        });

        // --- Magnetic CTA (desktop + fine pointer only) -------------------
        let magneticCleanup: (() => void) | undefined;
        if (isDesktop && ctaLinkRef.current && window.matchMedia("(pointer: fine)").matches) {
          const el = ctaLinkRef.current;
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
          const pull = 0.32; // restrained — a nudge toward the cursor, not a chase

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
          magneticCleanup = () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
          };
        }

        // --- 2 & 3. Scroll-linked depth + hand-off into section two ------
        // Completes within 65% of the hero's own height, not its full scroll
        // range — otherwise the effect is spread so thin across a ~92svh
        // section that a normal scroll gesture barely registers it. The
        // photograph drifts slower than the type, so the two columns
        // separate in depth on the way out instead of leaving as one slab.
        const scrub = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=65%",
            scrub: 0.5,
          },
        });
        scrub.to(contentRef.current, { y: isDesktop ? -80 : -42, opacity: 0.12, ease: "none" }, 0);
        if (bgImgRef.current && darkenRef.current) {
          scrub
            .to(bgImgRef.current, { y: isDesktop ? "7vh" : "4vh", scale: 1.06, ease: "none" }, 0)
            .to(darkenRef.current, { opacity: 0.5, ease: "none" }, 0);
        }

        return () => {
          safety.kill();
          split.revert();
          magneticCleanup?.();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // Pulled up under the sticky 72px bar so the photograph runs edge to
      // edge behind it; the extra top padding keeps the type clear of the nav.
      // --accent is pinned bright for the whole hero: every accent here sits
      // on --pine in both themes, where the light-mode forest green is too
      // low-contrast.
      className="relative isolate -mt-[calc(72px+env(safe-area-inset-top))] flex min-h-[92svh] flex-col overflow-hidden bg-pine [--accent:#8fd1a8] [--on-accent:#12130f]"
      aria-labelledby="home-title"
    >
      {/* Scoped rather than added to globals.css, so the hero stays
          self-contained. These are deliberately plain CSS `@keyframes` and
          not a GSAP `repeat: -1` tween: a continuous JS tween turned out not
          to reliably tick in this project's production build, and CSS
          animation has no such failure mode. Only `transform` is animated
          (the blur is static), so the whole thing stays on the compositor. */}
      <style>{`
        .chh-field { position: absolute; inset: 0; z-index: -10; overflow: hidden; }

        .chh-blob {
          position: absolute;
          aspect-ratio: 1;
          border-radius: 9999px;
          will-change: transform;
        }
        .chh-blob--a {
          left: -18%; top: -28%; width: 78%;
          filter: blur(70px);
          background: radial-gradient(circle, rgba(52,107,79,0.85), transparent 66%);
          animation: chh-drift-a 34s ease-in-out infinite;
        }
        .chh-blob--b {
          left: 0; bottom: -34%; width: 68%;
          filter: blur(80px);
          background: radial-gradient(circle, rgba(70,134,101,0.6), transparent 68%);
          animation: chh-drift-b 46s ease-in-out infinite;
        }
        .chh-blob--c {
          left: 16%; top: 18%; width: 52%;
          filter: blur(90px);
          background: radial-gradient(circle, rgba(216,169,64,0.24), transparent 68%);
          animation: chh-drift-c 58s ease-in-out infinite;
        }

        /* Settles the gradients back toward --pine so the copy never sits on
           the brightest part of a moving surface. Kept light enough that the
           drift stays perceptible — damp this too hard and the whole effect
           reads as uneven vignetting rather than movement. */
        .chh-veil {
          position: absolute; inset: 0;
          background: linear-gradient(105deg,
            rgba(25,23,18,0.5) 0%, rgba(25,23,18,0.2) 58%, rgba(25,23,18,0.46) 100%);
        }

        @keyframes chh-drift-a {
          0%, 100% { transform: translate3d(-8%, -6%, 0) scale(1); }
          50%      { transform: translate3d(7%, 6%, 0) scale(1.22); }
        }
        @keyframes chh-drift-b {
          0%, 100% { transform: translate3d(10%, 8%, 0) scale(1.12); }
          50%      { transform: translate3d(-6%, -9%, 0) scale(0.94); }
        }
        @keyframes chh-drift-c {
          0%, 100% { transform: translate3d(-4%, 12%, 0) scale(0.98); }
          50%      { transform: translate3d(9%, -8%, 0) scale(1.16); }
        }

        /* The photograph's own slow push. This lives on the <img> while GSAP
           drives the wrapper, because a CSS animation's value permanently
           beats an inline transform — put both on one element and the scroll
           parallax simply stops working. */
        .chh-kenburns {
          transform-origin: 62% 45%;
          animation: chh-kenburns 30s ease-in-out infinite alternate;
        }
        @keyframes chh-kenburns {
          from { transform: scale(1.01); }
          to   { transform: scale(1.13); }
        }

        /* The photo emerges out of the field rather than butting against it.
           A hard rectangle plus a hairline was the single most "boxy" thing
           about the previous pass.

           This is a mask, not a dark gradient laid on top. An overlay has to
           fade to some fixed colour, and the field beside it is lit by the
           drifting aurora — so the two can never match and a seam stays
           visible exactly where the edge is supposed to disappear. Masking
           dissolves the photograph into whatever is actually underneath it,
           which is the moving field itself, so there is nothing to match. */
        .chh-photo {
          -webkit-mask-image: linear-gradient(90deg,
            transparent 0%, rgba(0,0,0,0.28) 11%, rgba(0,0,0,0.82) 27%, #000 42%);
          mask-image: linear-gradient(90deg,
            transparent 0%, rgba(0,0,0,0.28) 11%, rgba(0,0,0,0.82) 27%, #000 42%);
        }

        /* A little tooth over the whole hero. Large flat fields of one colour
           are what read as cheap on a photographic page; this is the cheapest
           honest way to give them a surface. */
        .chh-grain {
          position: absolute; inset: 0; z-index: 5;
          pointer-events: none;
          opacity: 0.13;
          mix-blend-mode: overlay;
          background-size: 200px 200px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (prefers-reduced-motion: reduce) {
          .chh-blob, .chh-kenburns { animation: none; }
        }
      `}</style>

      {/* ---- The fluid field: three very large, very soft colour masses
          drifting on long, mismatched cycles (34s / 46s / 58s) so the loop
          never lines up and the surface reads as breathing rather than as
          decoration on a timer. The palette is the site's own two-tone —
          deep forest plus a trace of the warm gold used for marked phrases —
          so the hero is lit by the brand, not by a generic gradient.

          Written as real CSS rather than a stack of arbitrary Tailwind
          utilities on purpose: this is one self-contained decorative layer
          with a dozen interlocking values, it is far more legible expressed
          as rules, and it cannot be broken by a class string that never
          makes it into the generated stylesheet. ---- */}
      <div className="chh-field" aria-hidden="true">
        <div className="chh-blob chh-blob--a" />
        <div className="chh-blob chh-blob--b" />
        <div className="chh-blob chh-blob--c" />
        <div className="chh-veil" />
      </div>

      {/* ---- The photograph. Now the dominant element: nearly half the hero,
          bleeding off the top, right and bottom edges, with its near edge
          dissolved into the field so it stops reading as a pasted-in
          rectangle. The caption has been lifted off the flat strip it used to
          sit on and floats over the frame as a card, which is what gives the
          composition a foreground and a background instead of two side-by-side
          panels. ---- */}
      {hasCover && (
        <figure
          ref={panelRef}
          className="absolute inset-y-0 right-0 m-0 hidden w-[min(46vw,40rem)] lg:block"
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
          {/* The mask lives here, on the image container only — the caption
              card is a sibling outside it, so it stays fully opaque. */}
          <div className="chh-photo relative size-full overflow-hidden">
            {/* GSAP owns this wrapper's transform (entrance scale + scroll
                parallax); the slow push lives on the <img> inside it. */}
            <div ref={bgImgRef} className="size-full">
              {/* Real, openly-licensed photography — never a generated
                  illustration. Decorative here: the card below names the note
                  in text, so an alt description would only repeat it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={feature!.coverUrl!}
                alt=""
                fetchPriority="high"
                className="chh-kenburns size-full object-cover"
              />
            </div>

            {/* The site header floats over this corner of the photograph, and
                a cover can easily be bright there (a sunset sky, snow, sand).
                The nav is pinned white on the homepage, so without this the
                links would sit at whatever contrast the week's photo happens
                to give them. A short top scrim makes that a constant. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-40 [background:linear-gradient(180deg,rgba(12,16,12,0.78)_0%,rgba(12,16,12,0.34)_55%,transparent_100%)]"
            />
            {/* Gives the floating card something to sit on, so it never lands
                on a bright patch of surf or sky. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-64 [background:linear-gradient(0deg,rgba(12,16,12,0.85)_0%,rgba(12,16,12,0.3)_55%,transparent_100%)]"
            />
            {/* Scroll-driven only: deepens as the hero hands off to section
                two, so the photo recedes rather than cutting away. */}
            <div ref={darkenRef} className="absolute inset-0 bg-pine opacity-0" />
          </div>

          {/* The caption is what turns the photo from wallpaper into the
              artifact — it names the note the reader is about to open. */}
          <figcaption
            ref={captionRef}
            className="absolute bottom-[clamp(1.75rem,5vh,3.25rem)] left-[clamp(1.5rem,3vw,2.75rem)] max-w-[24rem] rounded-2xl border border-white/14 bg-[rgba(18,22,18,0.58)] px-6 py-5 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md"
          >
            <p className="font-note text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              {feature!.topic} · {feature!.readingMinutes} min read
            </p>
            <p className="mt-2 text-[17px] font-[560] leading-snug text-pine-ink">
              {feature!.title}
            </p>
          </figcaption>
        </figure>
      )}

      {/* Sits above both the field and the photograph (z-5) but below the
          type (z-10), so it textures the imagery without dirtying the copy. */}
      <div className="chh-grain" aria-hidden="true" />

      {/* ---- The type field ----
          The photo panel is positioned from the viewport's right edge while
          this column is inside the site's centred container, so the two are
          measured from different origins and the type will happily run under
          the photograph if left alone (it overlapped by 47px before this).
          Reserving the panel's own width as padding, plus a gap, is
          deliberately conservative: the container is already inset from the
          viewport edge, so the real clearance is always this gap or more.
          The split starts at `lg` rather than `md` because between 768 and
          1024 the remaining column is too narrow to set a headline this
          large — below that the layout stacks instead. */}
      <div
        ref={contentRef}
        className={`relative z-10 mx-auto flex w-[min(var(--w-wide),100%-2*var(--gutter))] flex-1 flex-col justify-center pb-[clamp(2.5rem,5vw,4rem)] pt-[calc(5.5rem+env(safe-area-inset-top))] ${
          // Only reserve the panel's width when there is actually a panel —
          // before the first note is published there is no photograph, and
          // holding the space open would strand the type in the left half of
          // an otherwise empty hero.
          // 88% of the panel's width, not 100% plus a gap: the type is now
          // allowed to cross ~12% into the frame, where `.chh-edge` is still
          // ~0.85 opaque, so the two halves interlock instead of sitting in
          // separate boxes — and the headline keeps its full size rather than
          // shrinking to fit beside a much larger photograph.
          hasCover ? "lg:pr-[calc(min(46vw,40rem)*0.88)]" : ""
        }`}
      >
        <p
          ref={kickerRef}
          // --pine-ink-3 is calibrated against flat --pine; the drifting field
          // is lighter than that wherever a colour mass passes, which pushes
          // this small uppercase text under 4.5:1. Tinting --pine-ink instead
          // keeps it quiet but keeps the ratio safe at the field's brightest.
          // Wraps rather than overflowing: at 390px this line already fills
          // 328 of 344 available pixels, so a longer topic name than "Oceans"
          // would otherwise run off the edge.
          className="flex flex-wrap items-center gap-x-3 gap-y-1 font-note text-[11px] uppercase tracking-[0.24em] text-pine-ink/75"
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--accent)]" />
          {feature ? `${feature.topic} · ${issueLabel}` : issueLabel}
        </p>

        <h1
          ref={headlineRef}
          id="home-title"
          className="mt-6 text-[clamp(2.35rem,1.4rem+3.8vw,4.75rem)] font-[640] leading-[0.99] tracking-[-0.035em] text-pine-ink"
        >
          {/* The two clauses are broken explicitly. Left to `text-balance`,
              this set as "The climate, one / week at a time." — splitting the
              accent phrase across lines, which is the one break the sentence
              cannot take. A headline this size is a composition, so the
              composition is stated rather than negotiated; the second line
              may still wrap on its own on narrow phones.

              Colour alone carries the emphasis. An underline used to draw in
              here, but at these widths the accent phrase often sits alone on
              a line, where a rule beneath it stops reading as an editorial
              mark and starts reading as a hyperlink. */}
          <span className="block">The climate,</span>
          <span className="block">
            <span className="text-[var(--accent)]">one week</span> at a time.
          </span>
        </h1>

        {/* The slogan states the reason the format exists, not a mood. The
            product's actual argument is that climate coverage fails by
            arriving all at once — so a single story a week is the remedy,
            and saying that out loud is what earns the rest of the page. */}
        <p
          ref={subRef}
          className="mt-7 max-w-[38ch] text-[clamp(1rem,0.95rem+0.3vw,1.2rem)] leading-relaxed text-pine-ink/80"
        >
          <span className="text-pine-ink">All of it at once is why we look away.</span> So: one
          overlooked story a week, explained clearly, with one small thing you can actually do.
        </p>

        {/* A solid CTA, not the previous ghost outline: on a flat field there
            is no reason to hedge, and one filled button reads as the single
            primary action far more clearly than a translucent border. */}
        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            ref={ctaLinkRef}
            href={(feature ? `/articles/${feature.slug}` : "/articles") as Route}
            className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--accent)] px-8 font-note text-sm tracking-[0.01em] text-[var(--on-accent)] shadow-[0_12px_34px_-12px_rgba(0,0,0,0.7)] transition-[background-color,box-shadow] duration-300 ease-out hover:bg-white hover:shadow-[0_16px_42px_-12px_rgba(0,0,0,0.8)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span>{feature ? "Read this week’s note" : "Start reading"}</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </Link>

          <Link
            href="/articles"
            className="inline-flex min-h-11 items-center gap-2 font-note text-sm text-pine-ink/78 underline-offset-[6px] transition-colors duration-200 hover:text-pine-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Browse every note
          </Link>
        </div>

        {/* ---- Mobile: the photograph as a band beneath the type, so the
            note is still shown rather than described. ---- */}
        {hasCover && (
          <figure className="mt-10 -mx-[var(--gutter)] lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feature!.coverUrl!}
              alt=""
              fetchPriority="high"
              className="h-[26svh] w-full object-cover"
            />
            <figcaption className="mt-4 px-[var(--gutter)]">
              <p className="font-note text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                {feature!.topic} · {feature!.readingMinutes} min read
              </p>
              <p className="mt-1.5 text-[15px] leading-snug text-pine-ink/85">{feature!.title}</p>
            </figcaption>
          </figure>
        )}

        {/* Left-set under the type. It was right-set for a while to dodge the
            theme toggle pinned to the bottom-left corner, but now that the
            photograph reaches further across, the right edge of this column
            sits in the dissolve — the cue ended up floating next to the note
            card, reading as clutter. Back under the copy, with enough space
            below it to clear the toggle. */}
        <div
          ref={cueRef}
          aria-hidden="true"
          className="mt-14 hidden items-center gap-3 self-start lg:flex"
        >
          <span className="h-px w-10 bg-white/25" />
          <span className="font-note text-[10px] uppercase tracking-[0.24em] text-pine-ink/70">
            Scroll
          </span>
        </div>
      </div>

      {/* Opening curtain: covers the whole hero, then wipes away (scaleY,
          top-anchored) as the very first entrance beat. Purely decorative —
          aria-hidden, and set to scaleY(0) outright under reduced motion so
          it never blocks content for anyone not seeing the animation. */}
      <div ref={curtainRef} className="absolute inset-0 z-20 bg-pine" aria-hidden="true" />

      {/* Closes the section on the same hairline weight the page uses below,
          so the hand-off into section two is a ruled edge, not a colour cut. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/12" />
    </section>
  );
}
