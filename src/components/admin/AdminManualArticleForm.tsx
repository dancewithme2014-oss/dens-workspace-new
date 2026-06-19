"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { useSitePreferences } from "@/lib/preferences";

type FormState = {
  title: string;
  summary: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string;
  category: string;
  tags: string;
  englishComment: string;
  publishNow: boolean;
};

const labels = {
  ru: {
    title: "Создать новость вручную",
    hint: "Запись будет сохранена напрямую в Supabase editorial_drafts.",
    submit: "Создать в Supabase",
    publishing: "Создание...",
    publishNow: "Сразу опубликовать",
    fields: ["Заголовок", "Краткое описание", "Полная статья", "Источник", "URL оригинала", "URL картинки оригинала", "Категория", "Теги", "English comment"] as const,
  },
  en: {
    title: "Create news manually",
    hint: "The article will be saved directly to Supabase editorial_drafts.",
    submit: "Create in Supabase",
    publishing: "Creating...",
    publishNow: "Publish immediately",
    fields: ["Title", "Summary", "Full article", "Source", "Original URL", "Original image URL", "Category", "Tags", "English comment"] as const,
  },
} as const;

export default function AdminManualArticleForm() {
  const router = useRouter();
  const { locale } = useSitePreferences();
  const t = labels[locale];
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({
    title: "",
    summary: "",
    body: "",
    sourceName: "",
    sourceUrl: "",
    imageUrl: "",
    category: "ai",
    tags: "AI, Future Tech",
    englishComment: "",
    publishNow: false,
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(current => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      setMessage(t.publishing);
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourceName: form.sourceName || null,
          sourceUrl: form.sourceUrl || null,
          imageUrl: form.imageUrl || null,
          englishComment: form.englishComment || null,
          tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        }),
      });
      const result = await response.json();
      if (!response.ok) return setMessage(`Error: ${result.error}`);
      router.push(`/admin/articles/${result.article.id}`);
      router.refresh();
    });
  };

  return <section className="admin-panel">
    <div className="admin-panel-head"><h2>{t.title}</h2><span>{t.hint}</span></div>
    <form className="admin-editor-form admin-manual-form" onSubmit={submit}>
      <label>{t.fields[0]}<input required value={form.title} onChange={event => set("title", event.target.value)}/></label>
      <label>{t.fields[1]}<textarea required value={form.summary} onChange={event => set("summary", event.target.value)}/></label>
      <label>{t.fields[2]}<textarea required className="article-body" value={form.body} onChange={event => set("body", event.target.value)}/></label>
      <div className="admin-form-row"><label>{t.fields[3]}<input value={form.sourceName} onChange={event => set("sourceName", event.target.value)}/></label><label>{t.fields[4]}<input value={form.sourceUrl} onChange={event => set("sourceUrl", event.target.value)}/></label></div>
      <label>{t.fields[5]}<input value={form.imageUrl} onChange={event => set("imageUrl", event.target.value)}/></label>
      <div className="admin-form-row"><label>{t.fields[6]}<input value={form.category} onChange={event => set("category", event.target.value)}/></label><label>{t.fields[7]}<input value={form.tags} onChange={event => set("tags", event.target.value)}/></label></div>
      <label>{t.fields[8]}<textarea value={form.englishComment} onChange={event => set("englishComment", event.target.value)}/></label>
      <label className="admin-check"><input type="checkbox" checked={form.publishNow} onChange={event => set("publishNow", event.target.checked)}/>{t.publishNow}</label>
      <div className="admin-editor-actions inline"><span>{message}</span><button className="primary" disabled={isPending} type="submit">{isPending ? t.publishing : t.submit}</button></div>
    </form>
  </section>;
}
