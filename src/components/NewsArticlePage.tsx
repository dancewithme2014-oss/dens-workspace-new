"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import SiteHeader from "@/components/SiteHeader";
import type { EditorialArticle } from "@/lib/editorial/types";
import { useSitePreferences } from "@/lib/preferences";

export default function NewsArticlePage({ articles }: { articles: { ru: EditorialArticle | null; en: EditorialArticle | null } }) {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const article = articles[locale] ?? articles.ru ?? articles.en;
  if (!article) return null;
  return <main className="news-page article-page"><AmbientBackground/><SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="news"/><article className="article-shell shell"><Link className="article-back" href="/news-feed"><ArrowLeft/>{locale === "ru" ? "Вернуться к ленте" : "Back to News Feed"}</Link><p className="eyebrow">{article.category.toUpperCase()}</p><h1>{article.title}<i/></h1><p className="article-summary">{article.summary}</p>{article.imageUrl && <div className="article-cover"><Image src={article.imageUrl} alt="" fill sizes="(max-width: 900px) 100vw, 980px" unoptimized/></div>}<div className="article-meta"><span>{article.sourceName}</span><span>{article.publishedAt ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(article.publishedAt)) : ""}</span>{article.sourceUrl && <a href={article.sourceUrl} target="_blank" rel="noreferrer">{locale === "ru" ? "Первоисточник" : "Original source"}<ExternalLink/></a>}</div><div className="article-body">{article.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="article-tags">{article.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article></main>;
}
