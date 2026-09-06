import type { Metadata, Route } from "next";
import { Link } from "next-view-transitions";
import { listPublishedArticles } from "@/lib/articles/repository";
import { toNoteListItem } from "@/lib/format";
import { NoteList } from "@/components/note-list";
import { Reveal } from "@/components/reveal";
import styles from "./articles.module.css";

export const metadata: Metadata = { title: "Articles" };
export const revalidate = 300;

type PageProps = { searchParams: Promise<{ topic?: string }> };

export default async function ArticlesPage({ searchParams }: PageProps) {
  const { topic } = await searchParams;
  const articles = await listPublishedArticles({ limit: 50 });

  const topics = Array.from(new Set(articles.map((article) => article.topic))).sort();
  const activeTopic = topic && topics.includes(topic) ? topic : null;
  const visible = activeTopic ? articles.filter((article) => article.topic === activeTopic) : articles;

  return (
    <>
      <Reveal as="header" className={styles.head}>
        <p className="eyebrow">The archive</p>
        <h1 className={styles.title}>Every note, in one place</h1>
        <p className={styles.intro}>
          One story a week, each paired with a small action. Browse by what you want to notice.
        </p>
      </Reveal>

      {topics.length > 0 && (
        <nav className={styles.filter} aria-label="Filter notes by topic">
          <Link href={"/articles" as Route} className={styles.filterLink} data-active={!activeTopic}>
            All
          </Link>
          {topics.map((name) => (
            <Link
              key={name}
              href={`/articles?topic=${encodeURIComponent(name)}` as Route}
              className={styles.filterLink}
              data-active={activeTopic === name}
              aria-current={activeTopic === name ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
      )}

      {visible.length > 0 ? (
        // NoteList staggers its own rows in on scroll now, so no wrapping
        // Reveal here — this div is layout only (width/centering).
        <div className={styles.list}>
          <NoteList items={visible.map(toNoteListItem)} />
        </div>
      ) : (
        <p className={styles.empty}>No notes have been published yet. Check back soon.</p>
      )}
    </>
  );
}
