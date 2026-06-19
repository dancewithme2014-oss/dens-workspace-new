"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSitePreferences } from "@/lib/preferences";

type Item = { id: string; status: string; version: number; updatedAt: string; title: string; locale: string; source: string };

const copy = {
  ru: { search: "Поиск по материалам", all: "Все статусы", empty: "Материалы не найдены.", statuses: { pending_approval: "На проверке", draft: "Черновики", approved: "Подтверждено", scheduled: "Запланировано", published: "Опубликовано", failed: "Ошибки" } },
  en: { search: "Search articles", all: "All statuses", empty: "No articles found.", statuses: { pending_approval: "Review", draft: "Drafts", approved: "Approved", scheduled: "Scheduled", published: "Published", failed: "Failed" } },
} as const;

export default function AdminArticleList({ items }: { items: Item[] }) {
  const { locale } = useSitePreferences();
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visible = useMemo(() => items.filter(item => (status === "all" || item.status === status) && `${item.title} ${item.source}`.toLowerCase().includes(query.toLowerCase())), [items, query, status]);
  return <>
    <div className="admin-filters"><label><Search/><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search}/></label><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">{t.all}</option>{Object.entries(t.statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="admin-article-list">{visible.map(item => <Link href={`/admin/articles/${item.id}`} key={item.id}><span className={`status status-${item.status}`}>{item.status}</span><strong>{item.title}</strong><small>{item.locale} · {item.source} · v{item.version}</small><ArrowRight/></Link>)}{visible.length === 0 && <div className="admin-empty">{t.empty}</div>}</div>
  </>;
}
