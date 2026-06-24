import AdminHeading from "@/components/admin/AdminHeading";
import AdminManualArticleForm from "@/components/admin/AdminManualArticleForm";

export default function AdminNewArticlePage() {
  return <><AdminHeading eyebrow={{ ru: "Библиотека материалов", en: "Content library" }} title={{ ru: "Новая статья", en: "New article" }}/><AdminManualArticleForm/></>;
}
