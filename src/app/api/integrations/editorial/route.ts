import { NextResponse } from "next/server";
import { editorialResultSchema } from "@/lib/editorial/schema";
import { verifyIntegrationSignature } from "@/lib/integrations/signature";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyIntegrationSignature(raw, request.headers.get("x-dens-signature"))) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  const parsed = editorialResultSchema.safeParse(safeJson(raw));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  const value = parsed.data;
  const slug = slugify(value.title) || `${value.locale}-${value.articleId}`;
  const { data: saved, error: saveError } = await supabase.rpc("save_article_localization", { target_article_id: value.articleId, expected_version: value.expectedVersion, target_locale: value.locale, payload: { ...value, slug, translationStatus: "draft" } });
  if (saveError) return NextResponse.json({ error: saveError.message }, { status: saveError.message.includes("version_conflict") ? 409 : 400 });
  const { data: transitioned, error: transitionError } = await supabase.rpc("transition_article", { target_article_id: value.articleId, expected_version: saved.version, target_status: "pending_approval", event_note: "AI editorial completed", target_scheduled_at: null, actor_kind: "system" });
  if (transitionError) return NextResponse.json({ error: transitionError.message }, { status: 400 });
  return NextResponse.json({ article: transitioned, localization: { locale: value.locale, slug } });
}

function slugify(value: string) { return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9а-яё]+/giu, "-").replace(/^-|-$/g, "").slice(0, 180); }
function safeJson(value: string) { try { return JSON.parse(value); } catch { return null; } }
