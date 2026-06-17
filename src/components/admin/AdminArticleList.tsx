"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Item = { id: string; status: string; version: number; updatedAt: string; title: string; locale: string; source: string };

export default function AdminArticleList({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visible = useMemo(() => items.filter(item => (status === "all" || item.status === status) && `${item.title} ${item.source}`.toLowerCase().includes(query.toLowerCase())), [items, query, status]);
  return <>
    <div className="admin-filters"><label><Search/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Поиск по материалам"/></label><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">Все статусы</option><option value="pending_approval">На проверке</option><option value="draft">Черновики</option><option value="approved">Подтверждено</option><option value="scheduled">Запланировано</option><option value="published">Опубликовано</option><option value="failed">Ошибки</option></select></div>
    <div className="admin-article-list">{visible.map(item => <Link href={`/admin/articles/${item.id}`} key={item.id}><span className={`status status-${item.status}`}>{item.status}</span><strong>{item.title}</strong><small>{item.locale} · {item.source} · v{item.version}</small><ArrowRight/></Link>)}{visible.length === 0 && <div className="admin-empty">Материалы не найдены.</div>}</div>
  </>;
}
