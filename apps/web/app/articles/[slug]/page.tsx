import type { Metadata, Route } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { ActionPicker } from "@/components/action-picker";
import { ArticleBody } from "@/components/article-body";
import { ClimateSummary } from "@/components/climate-summary";
import { NoteList } from "@/components/note-list";
import { ReadingProgress } from "@/components/reading-progress";
import { Reveal } from "@/components/reveal";
import { ShareNote } from "@/components/share-note";
import { getPublishedArticleBySlug, listPublishedArticles } from "@/lib/articles/repository";
import { formatDate, toNoteListItem } from "@/lib/format";

type PageProps = { params: Promise<{ slug: string }> };

function ArticleFigure({ article }: { article: NonNullable<Awaited<ReturnType<typeof getPublishedArticleBySlug>>> }) {
  if (!article.coverAsset) return null;
  return (
    <figure className="article__figure">
      {/* The ingestion pipeline stores trusted, licensed media URLs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.coverAsset.url} alt={article.coverAsset.altText} width={1600} height={1000} />
      <figcaption>
        {article.coverAsset.caption} {article.coverAsset.attribution}
        {article.coverAsset.sourceUrl && (
          <>
            {" · "}
            <a href={article.coverAsset.sourceUrl}>{article.coverAsset.license}</a>
          </>
        )}
      </figcaption>
    </figure>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const related = (await listPublishedArticles({ limit: 5 }))
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const dateLabel = formatDate(article.publishedAt);

  return (
    <>
      <ReadingProgress />
      <article className="article">
        <header className="article__hero">
          <Link href={"/articles" as Route} className="article__back">
            ← The archive
          </Link>
          <span className="chip">{article.topic}</span>
          <h1 className="article__title">{article.title}</h1>
          <p className="article__dek">{article.excerpt}</p>
          <div className="article__metarow">
            <div className="article__meta">
              {article.author && <span>By {article.author}</span>}
              {dateLabel && <span>{dateLabel}</span>}
              <span>{article.readingMinutes} min read</span>
            </div>
            <ShareNote title={article.title} />
          </div>
        </header>

        {article.coverAsset && article.generation?.visualPlan.placement === "cover" && (
          <ArticleFigure article={article} />
        )}

        <ArticleBody
          blocks={article.contentBlocks}
          afterIntroduction={
            article.coverAsset && article.generation?.visualPlan.placement === "after-introduction" ? (
              <ArticleFigure article={article} />
            ) : undefined
          }
        />

        {article.sourceLinks.length > 0 && (
          <Reveal as="section" className="article__sources" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Sources</h2>
            <ol>
              {article.sourceLinks.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>{source.label}</a>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {Object.keys(article.externalLinks).length > 0 && (
          <Reveal as="section" className="article__external" aria-labelledby="external-links-heading">
            <h2 id="external-links-heading">Also published on</h2>
            <div>
              {article.externalLinks.instagram && <a href={article.externalLinks.instagram}>Instagram</a>}
              {article.externalLinks.substack && <a href={article.externalLinks.substack}>Substack</a>}
              {article.externalLinks.medium && <a href={article.externalLinks.medium}>Medium</a>}
            </div>
          </Reveal>
        )}

        {article.generation && (
          <Reveal as="div" className="article__note">
            <ClimateSummary generation={article.generation} />
            <ActionPicker generation={article.generation} />
          </Reveal>
        )}
      </article>

      {related.length > 0 && (
        <Reveal as="section" className="article__more" aria-labelledby="more-heading">
          <p className="eyebrow">Keep noticing</p>
          <h2 id="more-heading">More notes</h2>
          <NoteList items={related.map(toNoteListItem)} />
        </Reveal>
      )}
    </>
  );
}
