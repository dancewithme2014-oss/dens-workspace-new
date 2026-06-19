import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const manualArticleSchema = z.object({
  title: z.string().min(1).max(220),
  summary: z.string().min(1).max(800),
  body: z.string().min(1),
  category: z.string().min(1).max(80).default("ai"),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  sourceName: z.string().max(180).nullable().optional(),
  sourceUrl: z.url().nullable().optional(),
  imageUrl: z.url().nullable().optional(),
  seoTitle: z.string().max(220).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  telegramText: z.string().max(4096).nullable().optional(),
  englishComment: z.string().max(4096).nullable().optional(),
  publishNow: z.boolean().default(false),
});

export async function POST(request: Request) {
  const parsed = manualArticleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });

  const payload = parsed.data;
  const status = payload.publishNow ? "published" : "draft";
  const sourceName = payload.sourceName || "Manual editorial";
  const sourceUrl = payload.sourceUrl || null;
  const imageUrl = payload.imageUrl || null;
  const id = crypto.randomUUID();
  const row = {
    external_id: `manual:${id}`,
    source_url: sourceUrl,
    canonical_url: sourceUrl,
    source_name: sourceName,
    source_author: null,
    slug: `${slugify(payload.title) || "manual"}-${id.slice(0, 8)}`,
    title: payload.title,
    summary: payload.summary,
    body: payload.body,
    seo_title: payload.seoTitle || payload.title,
    seo_description: payload.seoDescription || payload.summary,
    telegram_text: payload.telegramText || null,
    category: payload.category,
    tags: payload.tags,
    fact_warnings: [],
    image_url: imageUrl,
    status,
    published_at: payload.publishNow ? new Date().toISOString() : null,
    raw_source: { sourceName, sourceUrl, imageUrl, manual: true },
    raw_opinion: { englishComment: payload.englishComment || null, manual: true },
    version: 1,
  };

  const { data, error } = await supabase.from("editorial_drafts").insert(row).select("*").single();
  if (!error) return NextResponse.json({ article: data }, { status: 201 });

  const legacyRow = {
    external_id: row.external_id,
    source_url: sourceUrl,
    canonical_url: sourceUrl,
    source_name: sourceName,
    source_author: null,
    title: payload.title,
    summary: payload.summary,
    body: payload.body,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    telegram_text: row.telegram_text,
    category: payload.category,
    tags: payload.tags,
    fact_warnings: [],
    image_url: imageUrl,
    status,
    raw_source: row.raw_source,
    raw_opinion: row.raw_opinion,
  };
  const { data: legacyData, error: legacyError } = await supabase.from("editorial_drafts").insert(legacyRow).select("*").single();
  if (legacyError) return NextResponse.json({ error: legacyError.message }, { status: 400 });
  return NextResponse.json({ article: legacyData }, { status: 201 });
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/giu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}
