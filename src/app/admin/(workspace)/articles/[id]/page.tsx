import { notFound } from "next/navigation";
import AdminArticleEditor from "@/components/admin/AdminArticleEditor";
import AdminHeading from "@/components/admin/AdminHeading";
import { getAdminArticle } from "@/lib/editorial/server";

export default async function AdminArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAdminArticle(id);
  if (!item) notFound();
  const title = item.ru?.title ?? item.en?.title ?? "Материал";
  return <><AdminHeading eyebrow={{ ru: "Редактор материала", en: "Article editor" }} title={{ ru: title, en: title }}/><AdminArticleEditor initial={{ id, source: item.source, status: item.row.status, version: item.row.version ?? 1, category: item.row.category ?? "ai", tags: item.row.tags ?? [], imageUrl: item.row.image_url ?? null, ru: item.ru, en: item.en }}/></>;
}
