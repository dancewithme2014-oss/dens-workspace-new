import { NextResponse } from "next/server";
import { articleUpdateSchema, transitionSchema } from "@/lib/editorial/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { translateRussianArticleToEnglish, type TranslatedArticle } from "@/lib/editorial/translate";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const parsed = articleUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });

  const payload = parsed.data;
  const slug = payload.slug || `${payload.locale}-${id}`;
  const { data: existingArticle } = await supabase.from("articles").select("id").eq("id", id).maybeSingle();
  if (existingArticle) {
    const { data, error } = await supabase.rpc("save_article_localization", {
    target_article_id: id,
    expected_version: payload.expectedVersion,
    target_locale: payload.locale,
    payload: { ...payload, slug, translationStatus: "reviewed" },
  });
    if (error) return NextResponse.json({ error: error.message.includes("version_conflict") ? "version_conflict" : error.message }, { status: error.message.includes("version_conflict") ? 409 : 400 });

    if (payload.locale !== "ru") return NextResponse.json({ article: data });

    const translated = await translateRussianArticleToEnglish({
      slug,
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      telegramText: payload.telegramText,
      englishComment: payload.englishComment ?? null,
      tags: payload.tags,
      category: payload.category,
      sourceName: payload.sourceName ?? null,
      sourceUrl: payload.sourceUrl ?? null,
    });

    if (!translated.translation) return NextResponse.json({ article: data, translationWarning: translated.warning });

    const { data: translatedData, error: translationError } = await supabase.rpc("save_article_localization", {
      target_article_id: id,
      expected_version: data.version,
      target_locale: "en",
      payload: { ...translated.translation, imageUrl: payload.imageUrl, translationStatus: "auto_translated" },
    });
    if (translationError) {
      console.error("Unable to save English article translation", translationError.message);
      return NextResponse.json({ article: data, translation: translated.translation, translationWarning: "translation_save_failed" });
    }

    return NextResponse.json({ article: translatedData, translation: translated.translation, translationModel: translated.model });
  }

  const { data: existingDraft } = await supabase.from("editorial_drafts").select("raw_opinion").eq("id", id).maybeSingle();
  const rawOpinion = normalizeRecord(existingDraft?.raw_opinion);

  if (payload.locale === "en") {
    const enPatch = {
      raw_opinion: {
        ...rawOpinion,
        en: translationFromPayload(payload, slug),
        englishComment: payload.englishComment ?? rawOpinion.englishComment ?? null,
      },
      version: payload.expectedVersion + 1,
    };
    const { data: draft, error: draftError } = await supabase
      .from("editorial_drafts")
      .update(enPatch)
      .eq("id", id)
      .eq("version", payload.expectedVersion)
      .select("*")
      .maybeSingle();
    if (!draftError && draft) return NextResponse.json({ article: draft });
    const shouldTryLegacy = draftError?.message.includes("column") || draftError?.message.includes("schema cache") || draftError?.message.includes("version");
    if (!shouldTryLegacy && !draft) return NextResponse.json({ error: "version_conflict" }, { status: 409 });
    const { data: legacyDraft, error: legacyError } = await supabase
      .from("editorial_drafts")
      .update({ raw_opinion: enPatch.raw_opinion })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (legacyError) return NextResponse.json({ error: legacyError.message }, { status: 400 });
    if (!legacyDraft) return NextResponse.json({ error: "draft_not_found" }, { status: 404 });
    return NextResponse.json({ article: { ...legacyDraft, version: payload.expectedVersion + 1 } });
  }

  const translated = await translateRussianArticleToEnglish({
    slug,
    title: payload.title,
    summary: payload.summary,
    body: payload.body,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
    telegramText: payload.telegramText,
    englishComment: payload.englishComment ?? null,
    tags: payload.tags,
    category: payload.category,
    sourceName: payload.sourceName ?? null,
    sourceUrl: payload.sourceUrl ?? null,
  });
  const nextRawOpinion = {
    ...rawOpinion,
    englishComment: translated.translation?.englishComment ?? payload.englishComment ?? null,
    ...(translated.translation ? { en: translated.translation, autoTranslatedAt: new Date().toISOString(), translationModel: translated.model } : {}),
  };
  const fullPatch = {
    slug,
    title: payload.title,
    summary: payload.summary,
    body: payload.body,
    category: payload.category,
    tags: payload.tags,
    image_url: payload.imageUrl ?? null,
    source_url: payload.sourceUrl ?? null,
    source_name: payload.sourceName ?? null,
    seo_title: payload.seoTitle,
    seo_description: payload.seoDescription,
    telegram_text: payload.telegramText,
    raw_source: { sourceName: payload.sourceName ?? null, sourceUrl: payload.sourceUrl ?? null, imageUrl: payload.imageUrl ?? null },
    raw_opinion: nextRawOpinion,
    version: payload.expectedVersion + 1,
  };
  const legacyPatch = {
    title: payload.title,
    summary: payload.summary,
    body: payload.body,
    category: payload.category,
    tags: payload.tags,
    image_url: payload.imageUrl ?? null,
    source_url: payload.sourceUrl ?? null,
    source_name: payload.sourceName ?? null,
    seo_title: payload.seoTitle,
    seo_description: payload.seoDescription,
    telegram_text: payload.telegramText,
    raw_source: { sourceName: payload.sourceName ?? null, sourceUrl: payload.sourceUrl ?? null, imageUrl: payload.imageUrl ?? null },
    raw_opinion: nextRawOpinion,
  };
  const { data: draft, error: draftError } = await supabase
    .from("editorial_drafts")
    .update(fullPatch)
    .eq("id", id)
    .eq("version", payload.expectedVersion)
    .select("*")
    .maybeSingle();
  if (!draftError && draft) return NextResponse.json({ article: draft, translation: translated.translation, translationWarning: translated.warning, translationModel: translated.model });

  const shouldTryLegacy = draftError?.message.includes("column") || draftError?.message.includes("schema cache") || draftError?.message.includes("version");
  if (!shouldTryLegacy && !draft) return NextResponse.json({ error: "version_conflict" }, { status: 409 });

  const { data: legacyDraft, error: legacyError } = await supabase
    .from("editorial_drafts")
    .update(legacyPatch)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (legacyError) return NextResponse.json({ error: legacyError.message }, { status: 400 });
  if (!legacyDraft) return NextResponse.json({ error: "draft_not_found" }, { status: 404 });
  return NextResponse.json({ article: { ...legacyDraft, version: payload.expectedVersion + 1 }, translation: translated.translation, translationWarning: translated.warning, translationModel: translated.model });
}

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  const parsed = transitionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  const { data: existingArticle } = await supabase.from("articles").select("id").eq("id", id).maybeSingle();
  if (existingArticle) {
    const { data, error } = await supabase.rpc("transition_article", {
    target_article_id: id,
    expected_version: parsed.data.expectedVersion,
    target_status: parsed.data.toStatus,
    event_note: parsed.data.note ?? null,
    target_scheduled_at: parsed.data.scheduledAt ?? null,
    actor_kind: "admin",
  });
    if (error) return NextResponse.json({ error: error.message.includes("version_conflict") ? "version_conflict" : error.message }, { status: error.message.includes("version_conflict") ? 409 : 400 });
    return NextResponse.json({ article: data });
  }

  const patch = {
    status: parsed.data.toStatus,
    published_at: parsed.data.toStatus === "published" ? new Date().toISOString() : null,
    version: parsed.data.expectedVersion + 1,
  };
  const { data: draft, error: draftError } = await supabase
    .from("editorial_drafts")
    .update(patch)
    .eq("id", id)
    .eq("version", parsed.data.expectedVersion)
    .select("*")
    .maybeSingle();
  if (!draftError && draft) return NextResponse.json({ article: draft });

  const shouldTryLegacy = draftError?.message.includes("column") || draftError?.message.includes("schema cache") || draftError?.message.includes("version") || draftError?.message.includes("published_at");
  if (!shouldTryLegacy && !draft) return NextResponse.json({ error: "version_conflict" }, { status: 409 });

  const { data: legacyDraft, error: legacyError } = await supabase
    .from("editorial_drafts")
    .update({ status: parsed.data.toStatus })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (legacyError) return NextResponse.json({ error: legacyError.message }, { status: 400 });
  if (!legacyDraft) return NextResponse.json({ error: "draft_not_found" }, { status: 404 });
  return NextResponse.json({ article: { ...legacyDraft, version: parsed.data.expectedVersion + 1 } });
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function translationFromPayload(payload: ReturnType<typeof articleUpdateSchema.parse>, slug: string): TranslatedArticle {
  return {
    slug,
    title: payload.title,
    summary: payload.summary,
    body: payload.body,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
    telegramText: payload.telegramText,
    englishComment: payload.englishComment ?? null,
    tags: payload.tags,
    category: payload.category,
  };
}
