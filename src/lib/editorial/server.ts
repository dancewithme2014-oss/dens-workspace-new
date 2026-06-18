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
  slug: string | null;
  title: string;
  summary: string;
  body: string;
  seo_title: string | null;
  seo_description: string | null;
  telegram_text: string | null;
  category: string;
  tags: string[] | null;
  fact_warnings: string[] | null;
  image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  source_author: string | null;
  published_at: string | null;
  version: number;
  created_at: string;
  updated_at: string;
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
      en: null;
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
    imageUrl: row.image_url,
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

function mapDraft(row: EditorialDraftRow): EditorialArticle {
  return {
    id: row.id,
    slug: draftSlug(row),
    status: row.status,
    sourcePlatform: "manual",
    sourceName: row.source_name ?? "AI News Radar",
    sourceUrl: row.source_url ?? "",
    sourcePublishedAt: null,
    imageUrl: row.image_url,
    category: row.category,
    tags: row.tags ?? [],
    locale: "ru",
    title: row.title,
    summary: row.summary,
    body: row.body,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    telegramText: row.telegram_text,
    factWarnings: row.fact_warnings ?? [],
    version: row.version,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const articleSelect = `
  id,status,category,tags,image_url,version,published_at,created_at,updated_at,
  source_items(platform,source_name,source_url,source_published_at),
  article_localizations(locale,slug,title,summary,body,seo_title,seo_description,telegram_text,fact_warnings)
`;

const draftSelect = `
  id,status,slug,title,summary,body,seo_title,seo_description,telegram_text,
  category,tags,fact_warnings,image_url,source_name,source_url,source_author,
  published_at,version,created_at,updated_at
`;

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
    locale === "ru"
      ? supabase
          .from("editorial_drafts")
          .select(draftSelect)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(limit)
      : Promise.resolve({ data: [], error: null }),
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

  const drafts = ((draftResult.data ?? []) as unknown as EditorialDraftRow[]).map(mapDraft);

  const live = [...articles, ...drafts]
    .sort((a, b) => new Date(b.publishedAt ?? b.updatedAt).getTime() - new Date(a.publishedAt ?? a.updatedAt).getTime())
    .slice(0, limit);

  return live.length > 0 ? live : fallbackArticles.filter(item => item.locale === locale);
}

export async function getPublishedArticleBySlug(locale: ArticleLocale, slug: string) {
  const fallback = fallbackArticles.find(item => item.locale === locale && item.slug === slug) ?? null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

  if (locale === "ru") {
    const { data: draftBySlug, error: draftError } = await supabase
      .from("editorial_drafts")
      .select(draftSelect)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();
    if (!draftError && draftBySlug) return mapDraft(draftBySlug as unknown as EditorialDraftRow);

    const { data: publishedDrafts, error: draftListError } = await supabase
      .from("editorial_drafts")
      .select(draftSelect)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(100);
    if (!draftListError) {
      const draft = ((publishedDrafts ?? []) as unknown as EditorialDraftRow[]).find(item => draftSlug(item) === slug);
      if (draft) return mapDraft(draft);
    }
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
    supabase.from("editorial_drafts").select(draftSelect).order("updated_at", { ascending: false }).limit(100),
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
    ru: mapDraft(row),
    en: null,
  }));

  return [...articles, ...drafts]
    .sort((a, b) => new Date(b.row.updated_at).getTime() - new Date(a.row.updated_at).getTime())
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
  return { source: "editorial_drafts" as const, row, ru: mapDraft(row), en: null };
}
