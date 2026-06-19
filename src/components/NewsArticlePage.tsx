"use client";

import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import SiteHeader from "@/components/SiteHeader";
import type { ArticleLocale, EditorialArticle } from "@/lib/editorial/types";
import { useSitePreferences } from "@/lib/preferences";

type AdjacentArticles = { previous: EditorialArticle | null; next: EditorialArticle | null };

export default function NewsArticlePage({
  articles,
  adjacent,
}: {
  articles: { ru: EditorialArticle | null; en: EditorialArticle | null };
  adjacent: Record<ArticleLocale, AdjacentArticles>;
}) {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const article = articles[locale] ?? articles.ru ?? articles.en;
  const related = adjacent[locale] ?? adjacent.ru ?? adjacent.en;
  if (!article) return null;

  const title = article.title?.trim() || "";
  const summary = article.summary?.trim() || "";
  const shouldShowSummary = Boolean(summary && summary.toLowerCase() !== title.toLowerCase());
  const publishedDate = formatDate(article.publishedAt ?? article.updatedAt, locale);
  const readTime = Math.max(2, Math.ceil(article.body.split(/\s+/).length / 190));
  const sourceTarget = sourceTargetLabel(article.sourceUrl);
  const discussionHref = process.env.NEXT_PUBLIC_TELEGRAM_URL || "/#start-conversation";

  return <main className="news-page article-page">
    <AmbientBackground/>
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="news"/>
    <article className="article-shell shell">
      <Link className="article-back" href="/news-feed"><ArrowLeft/>{locale === "ru" ? "Вернуться к ленте" : "Back to News Feed"}</Link>

      <div className="article-kicker">
        <span>{article.category.toUpperCase()}</span>
        <span>{article.sourceName}</span>
        {publishedDate && <span>{publishedDate}</span>}
        <span>{readTime} {locale === "ru" ? "мин чтения" : "min read"}</span>
      </div>

      <h1>{title}<i/></h1>
      {shouldShowSummary && <p className="article-summary">{summary}</p>}

      {article.imageUrl && <div className="article-cover"><Image src={article.imageUrl} alt={title} fill sizes="(max-width: 900px) 100vw, 980px" unoptimized/></div>}

      {article.sourceUrl && <a className="article-source-strip" href={article.sourceUrl} target="_blank" rel="noreferrer">
        <span>{locale === "ru" ? "Источник:" : "Source:"} <b>{article.sourceName}</b></span>
        <strong>{sourceTarget}<ExternalLink/></strong>
      </a>}

      <div className="article-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => <h2>{children}</h2>,
            h3: ({ children }) => <h3>{children}</h3>,
            p: ({ children }) => <p>{children}</p>,
            a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        >
          {normalizeArticleMarkdown(article.body, article.sourceUrl)}
        </ReactMarkdown>
      </div>

      <a className="article-discuss" href={discussionHref}>
        <MessageCircle/>
        {locale === "ru" ? "Обсудить в Telegram" : "Discuss in Telegram"}
        <ArrowRight/>
      </a>

      <div className="article-tags">{article.tags.map(tag => <span key={tag}>{tag}</span>)}</div>

      {(related.previous || related.next) && <nav className="article-adjacent" aria-label={locale === "ru" ? "Соседние новости" : "Adjacent news"}>
        {related.previous && <AdjacentArticleCard label={locale === "ru" ? "Предыдущая новость" : "Previous story"} article={related.previous}/>}
        {related.next && <AdjacentArticleCard label={locale === "ru" ? "Следующая новость" : "Next story"} article={related.next}/>}
      </nav>}
    </article>
  </main>;
}

function AdjacentArticleCard({ label, article }: { label: string; article: EditorialArticle }) {
  return <Link className="article-adjacent-card" href={`/news-feed/${article.slug}`}>
    {article.imageUrl && <span className="article-adjacent-image"><Image src={article.imageUrl} alt="" fill sizes="(max-width: 700px) 50vw, 260px" unoptimized/></span>}
    <small>{label}</small>
    <strong>{article.title}</strong>
    <em><ArrowRight/></em>
  </Link>;
}

function formatDate(value: string | null, locale: ArticleLocale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function sourceTargetLabel(url: string) {
  if (!url) return "";
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "github.com") return "GitHub";
    if (host === "news.ycombinator.com") return "Hacker News";
    return host;
  } catch {
    return url;
  }
}

function normalizeArticleMarkdown(body: string, sourceUrl: string) {
  let markdown = body
    .replace(/<\s*strong\s*>([\s\S]*?)<\s*\/\s*strong\s*>/gi, "**$1**")
    .replace(/<\s*b\s*>([\s\S]*?)<\s*\/\s*b\s*>/gi, "**$1**")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n");

  if (sourceUrl) {
    const escapedUrl = sourceUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    markdown = markdown
      .replace(new RegExp(`\\n*#{1,3}\\s*(Источник|Source)\\s*\\n\\s*${escapedUrl}\\s*$`, "i"), "")
      .replace(new RegExp(`\\n*#{1,3}\\s*(Источник|Source)\\s+${escapedUrl}\\s*$`, "i"), "");
  }

  return markdown.trim();
}
