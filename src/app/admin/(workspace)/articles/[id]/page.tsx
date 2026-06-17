import { notFound } from "next/navigation";
import AdminArticleEditor from "@/components/admin/AdminArticleEditor";
import { getAdminArticle } from "@/lib/editorial/server";

export default async function AdminArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAdminArticle(id);
  if (!item) notFound();
  return <><header className="admin-heading"><div><p>ARTICLE EDITOR</p><h1>{item.ru?.title ?? item.en?.title ?? "Материал"}<i/></h1></div></header><AdminArticleEditor initial={{ id, status: item.row.status, version: item.row.version, category: item.row.category, tags: item.row.tags ?? [], imageUrl: item.row.image_url, ru: item.ru, en: item.en }}/></>;
}
