import { Link } from "next-view-transitions";
import type { Route } from "next";
import { Reveal } from "@/components/reveal";
import styles from "./note-list.module.css";

export type NoteListItem = {
  slug: string;
  topic: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
  dateLabel: string | null;
  coverUrl: string | null;
};

/**
 * An editorial index — a publication contents page, not a card grid. Each entry
 * is a full-width row with a hover-revealed thumbnail. `startIndex` lets the
 * numbering continue across sections (e.g. after a featured lead). Rows
 * stagger in as they cross the viewport; the delay is capped so a long
 * archive doesn't turn into a multi-second waterfall.
 */
export function NoteList({ items, startIndex = 0 }: { items: NoteListItem[]; startIndex?: number }) {
  return (
    <ol className={styles.list}>
      {items.map((item, index) => (
        <Reveal as="li" key={item.slug} className={styles.row} delay={Math.min(index, 8) * 45}>
          <Link href={`/articles/${item.slug}` as Route} className={styles.link}>
            <span className={styles.index}>{String(startIndex + index + 1).padStart(2, "0")}</span>

            <span className={styles.main}>
              <span className={styles.topline}>
                <span className="chip">{item.topic}</span>
                <span className={styles.meta}>
                  {item.dateLabel && <span>{item.dateLabel}</span>}
                  <span>{item.readingMinutes} min</span>
                </span>
              </span>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.excerpt}>{item.excerpt}</span>
            </span>

            <span className={styles.thumb} aria-hidden="true">
              {item.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverUrl} alt="" width={220} height={150} loading="lazy" />
              ) : (
                <span className={styles.thumbFallback} />
              )}
            </span>
          </Link>
        </Reveal>
      ))}
    </ol>
  );
}
