import "server-only";

import { fallbackArticles } from "@/lib/editorial/fallback";
import type { ArticleLocale, EditorialArticle, EditorialProfile } from "@/lib/editorial/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ArticleRow = {
  id: string;
  status: EditorialArticle["status"];
  category: string;
  tags: string[] | null;
  image_url: string | null;
  version: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  source_items: {
    platform: EditorialArticle["sourcePlatform"];
    source_name: string;
    source_url: string;
    source_published_at: string | null;
  } | null;
  article_localizations: Array<{
    locale: ArticleLocale;
    slug: string;
    title: string;
    summary: string;
    body: string;
    seo_title: string | null;
    seo_description: string | null;
    telegram_text: string | null;
    fact_warnings: string[] | null;
  }>;
};

type EditorialDraftRow = {
  id: string;
  status: EditorialArticle["status"];
  slug?: string | null;
  title: string;
  summary: string;
  body: string;
  seo_title?: string | null;
  seo_description?: string | null;
  telegram_text?: string | null;
  category?: string | null;
  tags?: string[] | null;
  fact_warnings?: string[] | null;
  image_url?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  source_author?: string | null;
  raw_source?: Record<string, unknown> | null;
    raw_opinion?: Record<string, unknown> | null;
  published_at?: string | null;
  version?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminArticleItem =
  | {
      source: "articles";
      row: ArticleRow;
      ru: EditorialArticle | null;
      en: EditorialArticle | null;
    }
  | {
      source: "editorial_drafts";
      row: EditorialDraftRow;
      ru: EditorialArticle;
    en: EditorialArticle | null;
    };

function mapArticle(row: ArticleRow, locale: ArticleLocale): EditorialArticle | null {
  const translation = row.article_localizations.find(item => item.locale === locale);
  if (!translation) return null;
  return {
    id: row.id,
    slug: translation.slug,
    status: row.status,
    sourcePlatform: row.source_items?.platform ?? "manual",
    sourceName: row.source_items?.source_name ?? "Den Workspace",
    sourceUrl: row.source_items?.source_url ?? "",
    sourcePublishedAt: row.source_items?.source_published_at ?? null,
    imageUrl: row.image_url ?? null,
    category: row.category,
    tags: row.tags ?? [],
    locale,
    title: translation.title,
    summary: translation.summary,
    body: translation.body,
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    telegramText: translation.telegram_text,
    factWarnings: translation.fact_warnings ?? [],
    version: row.version,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/giu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

function draftSlug(row: EditorialDraftRow) {
  return row.slug || slugify(row.title) || row.id;
}

function mapDraft(row: EditorialDraftRow, locale: ArticleLocale = "ru"): EditorialArticle | null {
  const timestamp = row.updated_at ?? row.created_at ?? new Date(0).toISOString();
  const rawSource = row.raw_source ?? {};
  const rawOpinion = row.raw_opinion ?? {};
  const rawTranslation = rawOpinion.en && typeof rawOpinion.en === "object" ? rawOpinion.en as Record<string, unknown> : null;
  if (locale === "en" && !rawTranslation) return null;
  const rawImageUrl = typeof rawSource.imageUrl === "string" ? rawSource.imageUrl : null;
  const rawSourceUrl = typeof rawSource.sourceUrl === "string" ? rawSource.sourceUrl : null;
  const rawSourceName = typeof rawSource.sourceName === "string" ? rawSource.sourceName : null;
  const englishComment = typeof rawOpinion.englishComment === "string" ? rawOpinion.englishComment : null;
  return {
    id: row.id,
    slug: locale === "en" ? stringOr(rawTranslation?.slug, draftSlug(row)) : draftSlug(row),
    status: row.status,
    sourcePlatform: "manual",
    sourceName: row.source_name ?? rawSourceName ?? "AI News Radar",
    sourceUrl: row.source_url ?? rawSourceUrl ?? "",
    sourcePublishedAt: null,
    imageUrl: row.image_url ?? rawImageUrl,
    category: row.category ?? "ai",
    tags: row.tags ?? [],
    locale,
    title: locale === "en" ? stringOr(rawTranslation?.title, row.title) : row.title,
    summary: locale === "en" ? stringOr(rawTranslation?.summary, row.summary) : row.summary,
    body: locale === "en" ? stringOr(rawTranslation?.body, row.body) : row.body,
    seoTitle: locale === "en" ? nullableString(rawTranslation?.seoTitle) : row.seo_title ?? null,
    seoDescription: locale === "en" ? nullableString(rawTranslation?.seoDescription) : row.seo_description ?? null,
    telegramText: locale === "en" ? nullableString(rawTranslation?.telegramText) : row.telegram_text ?? null,
    englishComment: locale === "en" ? nullableString(rawTranslation?.englishComment) : englishComment,
    factWarnings: row.fact_warnings ?? [],
    version: row.version ?? 1,
    publishedAt: row.published_at ?? null,
    createdAt: row.created_at ?? timestamp,
    updatedAt: timestamp,
  };
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function nullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

const articleSelect = `
  id,status,category,tags,image_url,version,published_at,created_at,updated_at,
  source_items(platform,source_name,source_url,source_published_at),
  article_localizations(locale,slug,title,summary,body,seo_title,seo_description,telegram_text,fact_warnings)
`;

const draftSelect = "*";

export async function getPublishedArticles(locale: ArticleLocale, limit = 24) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackArticles.filter(item => item.locale === locale);

  const [articleResult, draftResult] = await Promise.all([
    supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .is("archived_at", null)
    .order("published_at", { ascending: false })
      .limit(limit),
    supabase
      .from("editorial_drafts")
      .select(draftSelect)
      .eq("status", "published")
      .limit(limit),
  ]);

  if (articleResult.error) {
    console.error("Unable to load published articles", articleResult.error.message);
  }
  if (draftResult.error) {
    console.error("Unable to load published editorial drafts", draftResult.error.message);
  }

  const articles = ((articleResult.data ?? []) as unknown as ArticleRow[])
    .map(row => mapArticle(row, locale))
    .filter((article): article is EditorialArticle => Boolean(article));

  const drafts = ((draftResult.data ?? []) as unknown as EditorialDraftRow[])
    .map(row => mapDraft(row, locale))
    .filter((article): article is EditorialArticle => Boolean(article));

  const live = [...articles, ...drafts]
    .sort((a, b) => new Date(b.publishedAt ?? b.updatedAt).getTime() - new Date(a.publishedAt ?? a.updatedAt).getTime())
    .slice(0, limit);

  return live.length > 0 ? live : fallbackArticles.filter(item => item.locale === locale);
}

export async function getPublishedArticleBySlug(locale: ArticleLocale, slug: string) {
  const fallback = fallbackArticles.find(item => item.locale === locale && item.slug === slug) ?? null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  const { data: draftBySlug, error: draftError } = await supabase
    .from("editorial_drafts")
    .select(draftSelect)
    .eq("status", "published")
    .limit(200);
  if (!draftError) {
    const draft = ((draftBySlug ?? []) as unknown as EditorialDraftRow[])
      .map(row => mapDraft(row, locale))
      .filter((item): item is EditorialArticle => Boolean(item))
      .find(item => item.slug === slug);
    if (draft) return draft;
  }

  const { data: localization, error: localizationError } = await supabase
    .from("article_localizations")
    .select("article_id")
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle();
  if (localizationError || !localization) return fallback;

  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("id", localization.article_id)
    .eq("status", "published")
    .is("archived_at", null)
    .maybeSingle();
  if (error || !data) return fallback;
  return mapArticle(data as unknown as ArticleRow, locale);
}

export async function getCurrentEditorialProfile(): Promise<EditorialProfile | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,display_name,avatar_url,role,active")
    .eq("id", authData.user.id)
    .maybeSingle();
  if (error) {
    console.error("Unable to load editorial profile", {
      userId: authData.user.id,
      message: error.message,
    });
    return null;
  }
  if (!data?.active) return null;
  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    role: data.role,
    active: data.active,
  };
}

export async function getAdminArticles() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const [articleResult, draftResult] = await Promise.all([
    supabase.from("articles").select(articleSelect).order("updated_at", { ascending: false }).limit(100),
    supabase.from("editorial_drafts").select(draftSelect).limit(100),
  ]);
  if (articleResult.error) console.error("Unable to load admin articles", articleResult.error.message);
  if (draftResult.error) console.error("Unable to load admin editorial drafts", draftResult.error.message);

  const articles = ((articleResult.data ?? []) as unknown as ArticleRow[]).map(row => ({
    source: "articles" as const,
    row,
    ru: mapArticle(row, "ru"),
    en: mapArticle(row, "en"),
  }));

  const drafts = ((draftResult.data ?? []) as unknown as EditorialDraftRow[]).map(row => ({
    source: "editorial_drafts" as const,
    row,
    ru: mapDraft(row, "ru")!,
    en: mapDraft(row, "en"),
  }));

  return [...articles, ...drafts]
    .sort((a, b) => new Date(b.row.updated_at ?? b.row.created_at ?? 0).getTime() - new Date(a.row.updated_at ?? a.row.created_at ?? 0).getTime())
    .slice(0, 100);
}

export async function getAdminArticle(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("articles").select(articleSelect).eq("id", id).maybeSingle();
  if (!error && data) {
    const row = data as unknown as ArticleRow;
    return { source: "articles" as const, row, ru: mapArticle(row, "ru"), en: mapArticle(row, "en") };
  }

  const { data: draft, error: draftError } = await supabase
    .from("editorial_drafts")
    .select(draftSelect)
    .eq("id", id)
    .maybeSingle();
  if (draftError || !draft) return null;
  const row = draft as unknown as EditorialDraftRow;
  return { source: "editorial_drafts" as const, row, ru: mapDraft(row, "ru")!, en: mapDraft(row, "en") };
}
