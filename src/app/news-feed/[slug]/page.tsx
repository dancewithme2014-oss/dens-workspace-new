import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsArticlePage from "@/components/NewsArticlePage";
import { getPublishedArticleBySlug } from "@/lib/editorial/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug("ru", slug) ?? await getPublishedArticleBySlug("en", slug);
  return article ? { title: article.seoTitle ?? article.title, description: article.seoDescription ?? article.summary } : {};
}

export default async function NewsArticleRoute({ params }: Props) {
  const { slug } = await params;
  const [ru, en] = await Promise.all([getPublishedArticleBySlug("ru", slug), getPublishedArticleBySlug("en", slug)]);
  if (!ru && !en) notFound();
  return <NewsArticlePage articles={{ ru, en }}/>;
}
