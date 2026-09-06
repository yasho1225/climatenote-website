import type { Article } from "@/lib/articles/schema";
import type { NoteListItem } from "@/components/note-list";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/** Format an ISO date string with Intl; returns null when absent/invalid. */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

/** Project a full Article into the lean, serializable shape the index needs. */
export function toNoteListItem(article: Article): NoteListItem {
  return {
    slug: article.slug,
    topic: article.topic,
    title: article.title,
    excerpt: article.excerpt,
    readingMinutes: article.readingMinutes,
    dateLabel: formatDate(article.publishedAt),
    coverUrl: article.coverAsset?.url ?? null,
  };
}
