import AdminHeading from "@/components/admin/AdminHeading";
import AdminManualArticleForm from "@/components/admin/AdminManualArticleForm";

export default function AdminNewArticlePage() {
  return <><AdminHeading eyebrow="CONTENT LIBRARY" title={{ ru: "Новая статья", en: "New article" }}/><AdminManualArticleForm/></>;
}
