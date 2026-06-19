export type ArticleStatus =
  | "ingested"
  | "processing"
  | "draft"
  | "pending_approval"
  | "approved"
  | "scheduled"
  | "publishing"
  | "published"
  | "rejected"
  | "failed";

export type SourcePlatform = "rss" | "reddit" | "x" | "threads" | "manual";
export type PublicationChannel = "site" | "telegram" | "x" | "reddit" | "threads";
export type ArticleLocale = "ru" | "en";
export type UserRole = "owner" | "editor";

export interface EditorialArticle {
  id: string;
  slug: string;
  status: ArticleStatus;
  sourcePlatform: SourcePlatform;
  sourceName: string;
  sourceUrl: string;
  sourcePublishedAt: string | null;
  imageUrl: string | null;
  category: string;
  tags: string[];
  locale: ArticleLocale;
  title: string;
  summary: string;
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  telegramText: string | null;
  englishComment?: string | null;
  factWarnings: string[];
  version: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationJob {
  id: string;
  articleId: string;
  channel: PublicationChannel;
  status: "queued" | "processing" | "published" | "failed" | "cancelled";
  attempts: number;
  scheduledAt: string | null;
  lastError: string | null;
}

export interface EditorialProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  active: boolean;
}
