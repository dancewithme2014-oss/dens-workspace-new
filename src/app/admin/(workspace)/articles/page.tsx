import AdminArticleList from "@/components/admin/AdminArticleList";
import AdminCreateArticleLink from "@/components/admin/AdminCreateArticleLink";
import AdminHeading from "@/components/admin/AdminHeading";
import { getAdminArticles } from "@/lib/editorial/server";

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();
  const items = articles.map(item => {
    const article = item.ru ?? item.en;
    const source = item.source === "articles" ? item.row.source_items?.source_name ?? "Manual" : item.row.source_name ?? "AI News Radar";
    return { id: item.row.id, status: item.row.status, version: item.row.version ?? 1, updatedAt: item.row.updated_at ?? item.row.created_at ?? "", title: article?.title ?? "Без локализации", locale: article?.locale.toUpperCase() ?? "—", source };
  });
  return <><AdminHeading eyebrow="CONTENT LIBRARY" title={{ ru: "Материалы", en: "Articles" }}><AdminCreateArticleLink/></AdminHeading><section className="admin-panel"><AdminArticleList items={items}/></section></>;
}
