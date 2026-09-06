import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { articleSchema, type Article } from "./schema";
import { fixtureArticles } from "./fixtures";
import { firebaseAdminConfigured, getAdminFirestore } from "@/lib/firebase/admin";

function serializeTimestamp(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return null;
}

function parseArticle(id: string, data: Record<string, unknown>): Article {
  return articleSchema.parse({
    ...data,
    id,
    publishedAt: serializeTimestamp(data.publishedAt),
    generation: data.generation ?? null,
    author: data.author ?? null,
    sourceLinks: data.sourceLinks ?? [],
    externalLinks: data.externalLinks ?? {},
    contentBlocks: data.contentBlocks ?? [],
    coverAsset: data.coverAsset ?? null,
    readingMinutes: data.readingMinutes ?? 1,
  });
}

export async function listPublishedArticles({ limit }: { limit: number }): Promise<Article[]> {
  // No opt-in flag: any environment without real Firebase credentials — a
  // fresh clone, this sandbox, a teammate's laptop — falls back to the
  // fixtures automatically. Silently returning `[]` here previously made an
  // unconfigured environment look like a data-loss bug rather than what it
  // actually was (missing local credentials).
  if (!firebaseAdminConfigured()) {
    return fixtureArticles.slice(0, limit);
  }

  const snapshot = await getAdminFirestore()
    .collection("articles")
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((document) => parseArticle(document.id, document.data()));
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  if (!firebaseAdminConfigured()) {
    return fixtureArticles.find((article) => article.slug === slug) ?? null;
  }

  const snapshot = await getAdminFirestore()
    .collection("articles")
    .where("status", "==", "published")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const document = snapshot.docs.at(0);
  return document ? parseArticle(document.id, document.data()) : null;
}
