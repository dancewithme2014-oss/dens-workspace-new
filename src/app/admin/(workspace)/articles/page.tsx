import AdminArticleList from "@/components/admin/AdminArticleList";
import { getAdminArticles } from "@/lib/editorial/server";

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();
  const items = articles.map(item => {
    const article = item.ru ?? item.en;
    return { id: item.row.id, status: item.row.status, version: item.row.version, updatedAt: item.row.updated_at, title: article?.title ?? "Без локализации", locale: article?.locale.toUpperCase() ?? "—", source: item.row.source_items?.source_name ?? "Manual" };
  });
  return <><header className="admin-heading"><div><p>CONTENT LIBRARY</p><h1>Материалы<i/></h1></div></header><section className="admin-panel"><AdminArticleList items={items}/></section></>;
}
