import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, FileText } from "lucide-react";
import { getAdminArticles } from "@/lib/editorial/server";

export default async function AdminDashboardPage() {
  const articles = await getAdminArticles();
  const counts = articles.reduce<Record<string, number>>((acc, item) => { acc[item.row.status] = (acc[item.row.status] ?? 0) + 1; return acc; }, {});
  const stats = [
    ["На проверке", counts.pending_approval ?? 0, Clock3],
    ["Опубликовано", counts.published ?? 0, CheckCircle2],
    ["Ошибки", counts.failed ?? 0, AlertTriangle],
    ["Всего материалов", articles.length, FileText],
  ] as const;
  return <>
    <header className="admin-heading"><div><p>EDITORIAL DASHBOARD</p><h1>Редакционная очередь<i/></h1></div><Link href="/admin/articles">Все материалы<ArrowRight/></Link></header>
    <section className="admin-stats">{stats.map(([label, value, Icon]) => <article key={label}><Icon/><strong>{value}</strong><span>{label}</span></article>)}</section>
    <section className="admin-panel"><div className="admin-panel-head"><h2>Последние материалы</h2><span>Supabase source of truth</span></div><div className="admin-article-list">{articles.slice(0, 8).map(item => { const article = item.ru ?? item.en; return <Link href={`/admin/articles/${item.row.id}`} key={item.row.id}><span className={`status status-${item.row.status}`}>{item.row.status}</span><strong>{article?.title ?? "Без локализации"}</strong><small>{article?.locale.toUpperCase() ?? "—"} · v{item.row.version}</small><ArrowRight/></Link>; })}{articles.length === 0 && <div className="admin-empty">После подключения Supabase здесь появится очередь материалов из n8n.</div>}</div></section>
  </>;
}
