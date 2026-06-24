import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import { getAdminArticles } from "@/lib/editorial/server";

export default async function AdminDashboardPage() {
  const articles = await getAdminArticles();
  const counts = articles.reduce<Record<string, number>>((acc, item) => { acc[item.row.status] = (acc[item.row.status] ?? 0) + 1; return acc; }, {});
  const items = articles.map(item => {
    const article = item.ru ?? item.en;
    return { id: item.row.id, status: item.row.status, title: article?.title ?? "Без локализации", locale: article?.locale.toUpperCase() ?? "-", version: item.row.version ?? 1 };
  });

  return <AdminDashboardContent counts={counts} articles={items}/>;
}
