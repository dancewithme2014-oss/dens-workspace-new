import { NextResponse } from "next/server";
import { ingestionPayloadSchema } from "@/lib/editorial/schema";
import { verifyIntegrationSignature } from "@/lib/integrations/signature";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyIntegrationSignature(raw, request.headers.get("x-dens-signature"))) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  const parsed = ingestionPayloadSchema.safeParse(safeJson(raw));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  const item = parsed.data;

  const { data: canonicalMatch } = await supabase.from("source_items").select("id").eq("canonical_url", item.canonicalUrl).maybeSingle();
  const { data: fingerprintMatch } = canonicalMatch
    ? { data: null }
    : await supabase.from("source_items").select("id").eq("fingerprint", item.fingerprint).maybeSingle();
  const existing = canonicalMatch ?? fingerprintMatch;
  if (existing) {
    const { data: article } = await supabase.from("articles").select("id,status,version").eq("source_item_id", existing.id).maybeSingle();
    return NextResponse.json({ duplicate: true, sourceItemId: existing.id, article });
  }

  const { data: sourceItem, error: sourceError } = await supabase.from("source_items").insert({ source_id: null, platform: item.sourcePlatform, external_id: item.externalId, canonical_url: item.canonicalUrl, source_url: item.sourceUrl, source_name: item.sourceName, author: item.author ?? null, locale: item.locale, original_title: item.title, raw_content: item.rawContent, image_url: item.imageUrl ?? null, source_published_at: item.publishedAt ?? null, fingerprint: item.fingerprint, category: item.category }).select("id").single();
  if (sourceError) return NextResponse.json({ error: sourceError.code === "23505" ? "duplicate" : sourceError.message }, { status: sourceError.code === "23505" ? 409 : 400 });
  const { data: article, error: articleError } = await supabase.from("articles").insert({ source_item_id: sourceItem.id, status: "ingested", category: item.category, image_url: item.imageUrl ?? null }).select("id,status,version").single();
  if (articleError) return NextResponse.json({ error: articleError.message }, { status: 400 });
  return NextResponse.json({ duplicate: false, sourceItemId: sourceItem.id, article }, { status: 201 });
}

function safeJson(value: string) { try { return JSON.parse(value); } catch { return null; } }
