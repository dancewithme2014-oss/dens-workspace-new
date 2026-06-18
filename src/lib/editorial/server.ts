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

const articleSelect = `
  id,status,category,tags,image_url,version,published_at,created_at,updated_at,
  source_items(platform,source_name,source_url,source_published_at),
  article_localizations(locale,slug,title,summary,body,seo_title,seo_description,telegram_text,fact_warnings)
`;

export async function getPublishedArticles(locale: ArticleLocale, limit = 24) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackArticles.filter(item => item.locale === locale);

  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .is("archived_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Unable to load published articles", error.message);
    return fallbackArticles.filter(item => item.locale === locale);
  }

  return ((data ?? []) as unknown as ArticleRow[])
    .map(row => mapArticle(row, locale))
    .filter((article): article is EditorialArticle => Boolean(article));
}

export async function getPublishedArticleBySlug(locale: ArticleLocale, slug: string) {
  const fallback = fallbackArticles.find(item => item.locale === locale && item.slug === slug) ?? null;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallback;

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
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) return [];
  return ((data ?? []) as unknown as ArticleRow[]).map(row => ({
    row,
    ru: mapArticle(row, "ru"),
    en: mapArticle(row, "en"),
  }));
}

export async function getAdminArticle(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("articles").select(articleSelect).eq("id", id).maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as ArticleRow;
  return { row, ru: mapArticle(row, "ru"), en: mapArticle(row, "en") };
}
