import { Link } from "next-view-transitions";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { listPublishedArticles } from "@/lib/articles/repository";
import { formatDate, toNoteListItem } from "@/lib/format";
import type { HeroFeature } from "@/components/home/home-hero";
import { ClimateHero } from "@/components/ui/climate-hero";
import { LoopScroll, type LoopStepData } from "@/components/home/loop-scroll";
import { NoteList } from "@/components/note-list";
import { Reveal } from "@/components/reveal";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { MarkedPhrase } from "@/components/marked-phrase";

export const revalidate = 300;

export default async function HomePage() {
  const articles = await listPublishedArticles({ limit: 6 });
  const [featuredArticle, ...rest] = articles;

  const feature: HeroFeature | null = featuredArticle
    ? {
        slug: featuredArticle.slug,
        title: featuredArticle.title,
        topic: featuredArticle.topic,
        excerpt: featuredArticle.excerpt,
        coverUrl: featuredArticle.coverAsset?.url ?? null,
        coverAlt: featuredArticle.coverAsset?.altText ?? "",
        readingMinutes: featuredArticle.readingMinutes,
        dateLabel: formatDate(featuredArticle.publishedAt),
      }
    : null;

  const issueLabel = feature?.dateLabel ? `This week · ${feature.dateLabel}` : "A weekly climate note";

  // Each step states what we promise, then shows the same idea in this week's
  // actual note — editor-approved summary text and a real suggested action.
  // Never invented statistics, and never a claim the product can't keep.
  const generation = featuredArticle?.generation;
  const action = generation?.suggestedActions[0];
  const noteTitle = featuredArticle?.title ?? null;

  const steps: LoopStepData[] = [
    {
      index: 1,
      label: "Learn",
      promise: "One story a week, explained until it actually makes sense.",
      evidence: generation?.summary.problem ?? null,
      noteTitle,
    },
    {
      index: 2,
      label: "Notice",
      promise: "Then you start seeing it in your own ordinary week.",
      evidence: generation?.summary.whyItMatters ?? null,
      noteTitle,
    },
    {
      index: 3,
      label: "Act",
      promise: "And you leave with one small thing you can keep doing.",
      evidence: action?.instruction ?? generation?.summary.whatWeCanDo ?? null,
      noteTitle,
    },
  ];

  return (
    <>
      {/* imageUrl/imageAlt deliberately not wired to feature.coverUrl: the
          hero always shows the same dark-forest photo (ClimateHero's own
          default) rather than switching to whatever this week's note
          happens to be about — a fixed, consistent brand image rather than
          a rotating one. Everything else (topic, reading time, CTA target)
          still reflects the real published note. */}
      <ClimateHero
        kicker={feature ? `${feature.topic} · ${issueLabel}` : issueLabel}
        ctaLabel={feature ? "Read this week’s note" : "Start reading"}
        ctaHref={feature ? `/articles/${feature.slug}` : "/articles"}
        topic={feature?.topic ?? null}
        readingTime={feature ? `${feature.readingMinutes} min read` : undefined}
      />

      {/* The turn: name the problem the product exists to solve, once. */}
      <section
        aria-labelledby="premise"
        className="mx-auto w-[min(var(--w-wide),100%-2*var(--gutter))] py-[clamp(3.5rem,8vw,6.5rem)]"
      >
        <Reveal>
          <h2
            id="premise"
            className="max-w-[19ch] font-[family-name:var(--display)] text-[clamp(1.9rem,1.2rem+2.8vw,3.2rem)] leading-[1.08] tracking-tight text-balance text-ink"
          >
            Most climate writing leaves you informed and{" "}
            <MarkedPhrase>stuck</MarkedPhrase>.
          </h2>
        </Reveal>
        {/* Sibling, not nested inside Reveal above: Reveal already animates
            the heading's entrance as a block, and ScrollRevealText drives
            its own scroll-scrubbed reveal — stacking the two on the same
            content would fade the container in while its words are
            simultaneously sharpening, which reads as chaotic rather than as
            two distinct, legible motion beats. Plain text with no nested
            components (unlike the heading above, which carries
            `MarkedPhrase`'s own positioned underline), so it's safe for
            SplitText. */}
        <ScrollRevealText className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ink-2">
          This one ends somewhere useful. Every note moves the same three ways:
        </ScrollRevealText>
      </section>

      <LoopScroll steps={steps} />

      {/* The artifact the loop produces. */}
      {feature && (
        <section
          aria-labelledby="this-week"
          className="border-t border-line bg-paper-2 py-[clamp(3rem,7vw,5.5rem)]"
        >
          <div className="mx-auto grid w-[min(var(--w-wide),100%-2*var(--gutter))] items-center gap-[clamp(2rem,5vw,4.5rem)] md:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-line">
                {feature.coverUrl ? (
                  // Trusted, licensed/generated media from the ingestion pipeline.
                  // Sits well below the fold, so it defers; dimensions are
                  // declared alongside aspect-ratio to keep CLS at zero.
                  // `h-auto` is required: without it, the width/height attributes
                  // become a fixed-height presentational hint that silently wins
                  // over the aspect-ratio utility, rendering at a literal 1200px.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={feature.coverUrl}
                    alt={feature.coverAlt}
                    width={1600}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] h-auto w-full object-cover"
                  />
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={90}>
              <p className="font-note text-xs uppercase tracking-[0.18em] text-accent">
                {issueLabel}
              </p>
              <h2
                id="this-week"
                className="mt-4 font-[family-name:var(--display)] text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] leading-[1.06] tracking-tight text-ink"
              >
                {feature.title}
              </h2>
              <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">
                {feature.excerpt}
              </p>
              <Link
                href={`/articles/${feature.slug}` as Route}
                className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-note text-sm text-on-accent transition-colors hover:bg-accent-bright"
              >
                Read the note
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <p className="mt-4 font-note text-xs text-ink-3">
                {feature.topic} · {feature.readingMinutes} min
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <section
        aria-labelledby="archive"
        className="mx-auto w-[min(var(--w-wide),100%-2*var(--gutter))] py-[clamp(3rem,6vw,5rem)]"
      >
        <Reveal as="div" className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="archive"
            className="font-[family-name:var(--display)] text-[clamp(1.6rem,1.1rem+1.8vw,2.3rem)] leading-tight tracking-tight text-ink"
          >
            Earlier notes
          </h2>
          <Link
            href="/articles"
            className="inline-flex min-h-11 items-center gap-2 font-note text-sm text-ink-2 transition-colors hover:text-accent"
          >
            All notes
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>

        <div className="mt-8">
          {rest.length > 0 ? (
            // NoteList staggers its own rows in on scroll now.
            <NoteList items={rest.map(toNoteListItem)} startIndex={1} />
          ) : featuredArticle ? null : (
            <div className="rounded-2xl border border-line px-6 py-12 text-center">
              <h3 className="font-[family-name:var(--display)] text-xl text-ink">
                The first Climate Note is on its way.
              </h3>
              <p className="mx-auto mt-2 max-w-[46ch] text-ink-2">
                The automated Drive pipeline places each new note here as it is published.
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="app" className="border-t border-line-strong bg-pine text-pine-ink">
        <div className="mx-auto w-[min(var(--w-wide),100%-2*var(--gutter))] py-[clamp(3rem,7vw,5.5rem)]">
          {/* The closing statement gets the scroll-scrubbed treatment
              instead of Reveal's fade-up — it's the last thing said on the
              page, so it earns a slightly more deliberate entrance than the
              block-level reveal used everywhere above it. Kept as a sibling
              to the Reveal-wrapped paragraph below, not nested inside it, for
              the same reason established earlier on this page. */}
          <ScrollRevealText
            as="h2"
            id="app"
            className="max-w-[18ch] font-[family-name:var(--display)] text-[clamp(1.9rem,1.2rem+2.6vw,3rem)] leading-[1.06] tracking-tight"
          >
            The reading lives here. The noticing lives in your pocket.
          </ScrollRevealText>
          <Reveal>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-pine-ink-3">
              Free, no account needed to read. An account only keeps your private notes — nothing
              you write is ever public.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
