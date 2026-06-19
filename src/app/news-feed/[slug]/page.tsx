import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsArticlePage from "@/components/NewsArticlePage";
import { getPublishedArticleBySlug, getPublishedArticles } from "@/lib/editorial/server";
import type { EditorialArticle } from "@/lib/editorial/types";

type Props = { params: Promise<{ slug: string }> };
type AdjacentArticles = { previous: EditorialArticle | null; next: EditorialArticle | null };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug("ru", slug) ?? await getPublishedArticleBySlug("en", slug);
  return article ? { title: article.seoTitle ?? article.title, description: article.seoDescription ?? article.summary } : {};
}

export default async function NewsArticleRoute({ params }: Props) {
  const { slug } = await params;
  const [ru, en, ruList, enList] = await Promise.all([
    getPublishedArticleBySlug("ru", slug),
    getPublishedArticleBySlug("en", slug),
    getPublishedArticles("ru", 50),
    getPublishedArticles("en", 50),
  ]);
  if (!ru && !en) notFound();
  return <NewsArticlePage articles={{ ru, en }} adjacent={{ ru: getAdjacentArticles(ruList, ru?.slug ?? slug), en: getAdjacentArticles(enList, en?.slug ?? slug) }}/>;
}

function getAdjacentArticles(articles: EditorialArticle[], slug: string): AdjacentArticles {
  const index = articles.findIndex(article => article.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: articles[index + 1] ?? null,
    next: articles[index - 1] ?? null,
  };
}
