"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArticleLocale, ArticleStatus, EditorialArticle } from "@/lib/editorial/types";

type Initial = { id: string; source: "articles" | "editorial_drafts"; status: ArticleStatus; version: number; category: string; tags: string[]; imageUrl: string | null; ru: EditorialArticle | null; en: EditorialArticle | null };

export default function AdminArticleEditor({ initial }: { initial: Initial }) {
  const [locale, setLocale] = useState<ArticleLocale>(initial.ru ? "ru" : "en");
  const [version, setVersion] = useState(initial.version);
  const [status, setStatus] = useState(initial.status);
  const [message, setMessage] = useState("");
  const article = locale === "ru" ? initial.ru : initial.en;
  const [forms, setForms] = useState(() => ({
    ru: fromArticle(initial.ru, initial), en: fromArticle(initial.en, initial),
  }));
  const form = forms[locale];
  const set = (key: keyof typeof form, value: string) => setForms(current => ({ ...current, [locale]: { ...current[locale], [key]: value } }));

  const save = async () => {
    setMessage("Сохранение…");
    const response = await fetch(`/api/admin/articles/${initial.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expectedVersion: version, locale, ...form, tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean), seoTitle: form.seoTitle || null, seoDescription: form.seoDescription || null, telegramText: form.telegramText || null }) });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error === "version_conflict" ? "Материал уже изменен в другом окне. Обновите страницу." : `Ошибка: ${result.error}`);
    setVersion(result.article.version); setMessage("Сохранено");
  };
  const transition = async (toStatus: ArticleStatus) => {
    setMessage("Обновление статуса…");
    const response = await fetch(`/api/admin/articles/${initial.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expectedVersion: version, toStatus }) });
    const result = await response.json();
    if (!response.ok) return setMessage(result.error === "version_conflict" ? "Версия устарела. Обновите страницу." : `Ошибка: ${result.error}`);
    setVersion(result.article.version); setStatus(result.article.status); setMessage("Статус обновлен");
  };

  return <div className="admin-editor">
    <div className="admin-editor-top"><div className="admin-tabs"><button className={locale === "ru" ? "active" : ""} onClick={() => setLocale("ru")}>RU</button><button className={locale === "en" ? "active" : ""} disabled={initial.source === "editorial_drafts"} onClick={() => setLocale("en")}>EN</button></div><span className={`status status-${status}`}>{status}</span><small>{initial.source === "editorial_drafts" ? "Supabase draft" : "Article"} · v{version}</small></div>
    <div className="admin-editor-grid"><section className="admin-editor-form"><label>Заголовок<input value={form.title} onChange={e => set("title", e.target.value)}/></label><label>Slug<input value={form.slug} onChange={e => set("slug", e.target.value)}/></label><label>Краткое описание<textarea value={form.summary} onChange={e => set("summary", e.target.value)}/></label><label>Полная статья<textarea className="article-body" value={form.body} onChange={e => set("body", e.target.value)}/></label><div className="admin-form-row"><label>Категория<input value={form.category} onChange={e => set("category", e.target.value)}/></label><label>Теги<input value={form.tags} onChange={e => set("tags", e.target.value)}/></label></div><label>Telegram preview<textarea value={form.telegramText} onChange={e => set("telegramText", e.target.value)}/></label><div className="admin-form-row"><label>SEO title<input value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)}/></label><label>SEO description<input value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)}/></label></div></section>
      <aside className="admin-preview"><p>PREVIEW</p>{initial.imageUrl && <div className="admin-preview-image"><Image src={initial.imageUrl} alt="" fill sizes="360px" unoptimized/></div>}<h2>{form.title || "Заголовок материала"}</h2><p>{form.summary}</p><small>{article?.sourceName ?? "Den Workspace"}</small></aside></div>
    <footer className="admin-editor-actions"><span>{message}</span><button onClick={save}>Сохранить</button><button onClick={() => transition("rejected")}>Отклонить</button><button onClick={() => transition("approved")}>Подтвердить</button><button className="primary" onClick={() => transition("published")}>Опубликовать на сайт</button></footer>
  </div>;
}

function fromArticle(article: EditorialArticle | null, initial: Initial) {
  return { slug: article?.slug ?? "", title: article?.title ?? "", summary: article?.summary ?? "", body: article?.body ?? "", category: article?.category ?? initial.category, tags: (article?.tags ?? initial.tags).join(", "), seoTitle: article?.seoTitle ?? "", seoDescription: article?.seoDescription ?? "", telegramText: article?.telegramText ?? "" };
}
