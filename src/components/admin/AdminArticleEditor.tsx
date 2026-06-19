"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { useSitePreferences } from "@/lib/preferences";
import type { ArticleLocale, ArticleStatus, EditorialArticle } from "@/lib/editorial/types";

type FormState = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  tags: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  telegramText: string;
  englishComment: string;
};

type Initial = {
  id: string;
  source: "articles" | "editorial_drafts";
  status: ArticleStatus;
  version: number;
  category: string;
  tags: string[];
  imageUrl: string | null;
  ru: EditorialArticle | null;
  en: EditorialArticle | null;
};

const copy = {
  ru: {
    save: "Сохранить",
    saving: "Сохранение...",
    saved: "Сохранено",
    reject: "Отклонить",
    approve: "Подтвердить",
    publish: "Опубликовать на сайт",
    updating: "Обновление статуса...",
    updated: "Статус обновлен",
    stale: "Материал уже изменен в другом окне. Обновите страницу.",
    preview: "Предпросмотр сайта",
    source: "Оригинал",
    englishComment: "Комментарий к оригинальной новости на английском",
    openSource: "Открыть источник",
    article: "Статья",
    supabaseDraft: "Черновик Supabase",
    status: {
      ingested: "получено",
      processing: "обработка",
      draft: "черновик",
      pending_approval: "на проверке",
      approved: "подтверждено",
      scheduled: "запланировано",
      publishing: "публикация",
      published: "опубликовано",
      rejected: "отклонено",
      failed: "ошибка",
    },
    labels: {
      title: "Заголовок",
      slug: "Адрес страницы",
      summary: "Краткое описание",
      body: "Полная статья",
      category: "Категория",
      tags: "Теги",
      sourceName: "Источник",
      sourceUrl: "URL оригинальной новости",
      imageUrl: "URL картинки оригинальной новости",
      telegramText: "Текст для Telegram",
      englishComment: "Комментарий на английском",
      seoTitle: "SEO-заголовок",
      seoDescription: "SEO-описание",
    },
  },
  en: {
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    reject: "Reject",
    approve: "Approve",
    publish: "Publish to site",
    updating: "Updating status...",
    updated: "Status updated",
    stale: "This article changed in another tab. Refresh the page.",
    preview: "Site preview",
    source: "Original source",
    englishComment: "English comment for the original news",
    openSource: "Open source",
    article: "Article",
    supabaseDraft: "Supabase draft",
    status: {
      ingested: "ingested",
      processing: "processing",
      draft: "draft",
      pending_approval: "review",
      approved: "approved",
      scheduled: "scheduled",
      publishing: "publishing",
      published: "published",
      rejected: "rejected",
      failed: "failed",
    },
    labels: {
      title: "Title",
      slug: "Slug",
      summary: "Summary",
      body: "Full article",
      category: "Category",
      tags: "Tags",
      sourceName: "Source",
      sourceUrl: "Original news URL",
      imageUrl: "Original image URL",
      telegramText: "Telegram preview",
      englishComment: "English source comment",
      seoTitle: "SEO title",
      seoDescription: "SEO description",
    },
  },
} as const;

export default function AdminArticleEditor({ initial }: { initial: Initial }) {
  const { locale: uiLocale } = useSitePreferences();
  const t = copy[uiLocale];
  const [editorLocale, setEditorLocale] = useState<ArticleLocale>(initial.ru ? "ru" : "en");
  const [version, setVersion] = useState(initial.version);
  const [status, setStatus] = useState(initial.status);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const article = editorLocale === "ru" ? initial.ru : initial.en;
  const [forms, setForms] = useState(() => ({
    ru: fromArticle(initial.ru, initial),
    en: fromArticle(initial.en, initial),
  }));
  const form = forms[editorLocale];
  const busy = isPending;
  const imageUrl = form.imageUrl || initial.imageUrl || "";
  const englishComment = form.englishComment || buildEnglishComment(form);

  const set = (key: keyof FormState, value: string) => setForms(current => ({ ...current, [editorLocale]: { ...current[editorLocale], [key]: value } }));

  const save = () => startTransition(async () => {
    setMessage(t.saving);
    const response = await fetch(`/api/admin/articles/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form, version, editorLocale)),
    });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error === "version_conflict" ? t.stale : `Error: ${result.error}`);
    setVersion(result.article.version ?? version + 1);
    setMessage(t.saved);
  });

  const transition = (toStatus: ArticleStatus) => startTransition(async () => {
    setMessage(t.updating);
    const response = await fetch(`/api/admin/articles/${initial.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expectedVersion: version, toStatus }),
    });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error === "version_conflict" ? t.stale : `Error: ${result.error}`);
    setVersion(result.article.version ?? version + 1);
    setStatus(result.article.status);
    setMessage(t.updated);
  });

  return <div className="admin-editor">
    <div className="admin-editor-top">
      <div className="admin-tabs">
        <button className={editorLocale === "ru" ? "active" : ""} disabled={busy} onClick={() => setEditorLocale("ru")}>RU</button>
        <button className={editorLocale === "en" ? "active" : ""} disabled={busy || initial.source === "editorial_drafts"} onClick={() => setEditorLocale("en")}>EN</button>
      </div>
      <span className={`status status-${status}`}>{t.status[status]}</span>
      <small>{initial.source === "editorial_drafts" ? t.supabaseDraft : t.article} · v{version}</small>
    </div>

    <div className="admin-editor-grid">
      <section className="admin-editor-form">
        <label>{t.labels.title}<input value={form.title} onChange={event => set("title", event.target.value)}/></label>
        <label>{t.labels.slug}<input value={form.slug} onChange={event => set("slug", event.target.value)}/></label>
        <label>{t.labels.summary}<textarea value={form.summary} onChange={event => set("summary", event.target.value)}/></label>
        <label>{t.labels.body}<textarea className="article-body" value={form.body} onChange={event => set("body", event.target.value)}/></label>
        <div className="admin-form-row"><label>{t.labels.category}<input value={form.category} onChange={event => set("category", event.target.value)}/></label><label>{t.labels.tags}<input value={form.tags} onChange={event => set("tags", event.target.value)}/></label></div>
        <div className="admin-form-row"><label>{t.labels.sourceName}<input value={form.sourceName} onChange={event => set("sourceName", event.target.value)}/></label><label>{t.labels.sourceUrl}<input value={form.sourceUrl} onChange={event => set("sourceUrl", event.target.value)}/></label></div>
        <label>{t.labels.imageUrl}<input value={form.imageUrl} onChange={event => set("imageUrl", event.target.value)}/></label>
        <label>{t.labels.englishComment}<textarea value={form.englishComment} onChange={event => set("englishComment", event.target.value)}/></label>
        <label>{t.labels.telegramText}<textarea value={form.telegramText} onChange={event => set("telegramText", event.target.value)}/></label>
        <div className="admin-form-row"><label>{t.labels.seoTitle}<input value={form.seoTitle} onChange={event => set("seoTitle", event.target.value)}/></label><label>{t.labels.seoDescription}<input value={form.seoDescription} onChange={event => set("seoDescription", event.target.value)}/></label></div>
      </section>

      <aside className="admin-preview">
        <p>{t.preview}</p>
        {imageUrl && <div className="admin-preview-image"><Image src={imageUrl} alt="" fill sizes="360px" unoptimized/></div>}
        <h2>{form.title || t.labels.title}</h2>
        <p>{form.summary}</p>
        <small>{form.sourceName || article?.sourceName || "Den Workspace"}</small>
        <div className="admin-comment-preview">
          <strong>{t.englishComment}</strong>
          <p>{englishComment}</p>
          {form.sourceUrl && <a href={form.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink/>{t.openSource}</a>}
        </div>
      </aside>
    </div>

    <footer className="admin-editor-actions">
      <span>{message}</span>
      <button disabled={busy} onClick={save}>{busy ? t.saving : t.save}</button>
      <button disabled={busy} onClick={() => transition("rejected")}>{t.reject}</button>
      <button disabled={busy} onClick={() => transition("approved")}>{t.approve}</button>
      <button disabled={busy} className="primary" onClick={() => transition("published")}>{t.publish}</button>
    </footer>
  </div>;
}

function toPayload(form: FormState, version: number, locale: ArticleLocale) {
  return {
    expectedVersion: version,
    locale,
    ...form,
    tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean),
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    telegramText: form.telegramText || null,
    imageUrl: form.imageUrl || null,
    sourceUrl: form.sourceUrl || null,
    sourceName: form.sourceName || null,
    englishComment: form.englishComment || null,
  };
}

function fromArticle(article: EditorialArticle | null, initial: Initial): FormState {
  return {
    slug: article?.slug ?? "",
    title: article?.title ?? "",
    summary: article?.summary ?? "",
    body: article?.body ?? "",
    category: article?.category ?? initial.category,
    tags: (article?.tags ?? initial.tags).join(", "),
    sourceName: article?.sourceName ?? "",
    sourceUrl: article?.sourceUrl ?? "",
    imageUrl: article?.imageUrl ?? initial.imageUrl ?? "",
    seoTitle: article?.seoTitle ?? "",
    seoDescription: article?.seoDescription ?? "",
    telegramText: article?.telegramText ?? "",
    englishComment: article?.englishComment ?? "",
  };
}

function buildEnglishComment(form: FormState) {
  const title = form.title || "this story";
  const summary = form.summary || "the original report";
  return `My take on ${title}: ${summary}`;
}
