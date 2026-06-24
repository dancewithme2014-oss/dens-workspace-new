"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, FileText } from "lucide-react";
import AdminHeading from "@/components/admin/AdminHeading";
import { useSitePreferences } from "@/lib/preferences";

type DashboardArticle = {
  id: string;
  status: string;
  title: string;
  locale: string;
  version: number;
};

const copy = {
  ru: {
    eyebrow: "Редакционный дашборд",
    title: "Редакционная очередь",
    allArticles: "Все материалы",
    pending: "На проверке",
    published: "Опубликовано",
    failed: "Ошибки",
    total: "Всего материалов",
    latest: "Последние материалы",
    source: "Supabase источник данных",
    empty: "После подключения Supabase здесь появится очередь материалов из n8n.",
  },
  en: {
    eyebrow: "Editorial dashboard",
    title: "Editorial queue",
    allArticles: "All articles",
    pending: "In review",
    published: "Published",
    failed: "Errors",
    total: "Total articles",
    latest: "Latest articles",
    source: "Supabase source of truth",
    empty: "After Supabase is connected, the n8n editorial queue will appear here.",
  },
} as const;

export default function AdminDashboardContent({ counts, articles }: { counts: Record<string, number>; articles: DashboardArticle[] }) {
  const { locale } = useSitePreferences();
  const t = copy[locale];
  const stats = [
    [t.pending, counts.pending_approval ?? 0, Clock3],
    [t.published, counts.published ?? 0, CheckCircle2],
    [t.failed, counts.failed ?? 0, AlertTriangle],
    [t.total, articles.length, FileText],
  ] as const;

  return <>
    <AdminHeading eyebrow={t.eyebrow} title={{ ru: copy.ru.title, en: copy.en.title }}>
      <Link href="/admin/articles">{t.allArticles}<ArrowRight/></Link>
    </AdminHeading>
    <section className="admin-stats">{stats.map(([label, value, Icon]) => <article key={label}><Icon/><strong>{value}</strong><span>{label}</span></article>)}</section>
    <section className="admin-panel">
      <div className="admin-panel-head"><h2>{t.latest}</h2><span>{t.source}</span></div>
      <div className="admin-article-list">
        {articles.slice(0, 8).map(item => <Link href={`/admin/articles/${item.id}`} key={item.id}><span className={`status status-${item.status}`}>{item.status}</span><strong>{item.title}</strong><small>{item.locale} · v{item.version}</small><ArrowRight/></Link>)}
        {articles.length === 0 && <div className="admin-empty">{t.empty}</div>}
      </div>
    </section>
  </>;
}
