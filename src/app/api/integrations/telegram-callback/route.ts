import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { telegramCallbackSchema } from "@/lib/editorial/schema";
import { verifyIntegrationSignature } from "@/lib/integrations/signature";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const statusByAction = { approve: "approved", reject: "rejected", regenerate: "processing", schedule: "scheduled" } as const;

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyIntegrationSignature(raw, request.headers.get("x-dens-signature"))) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  const parsed = telegramCallbackSchema.safeParse(safeJson(raw));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  const allowed = (process.env.TELEGRAM_ALLOWED_USER_IDS ?? "").split(",").map(value => value.trim()).filter(Boolean);
  if (!allowed.includes(parsed.data.telegramUserId)) return NextResponse.json({ error: "telegram_user_not_allowed" }, { status: 403 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const { data: token, error: tokenError } = await supabase.from("approval_tokens").select("id,article_id,article_version,action,expires_at,used_at").eq("token_hash", tokenHash).maybeSingle();
  if (tokenError || !token || token.used_at || new Date(token.expires_at) < new Date()) return NextResponse.json({ error: "token_invalid_or_expired" }, { status: 409 });
  const { data: article, error } = await supabase.rpc("transition_article", { target_article_id: token.article_id, expected_version: token.article_version, target_status: statusByAction[token.action as keyof typeof statusByAction], event_note: `Telegram ${token.action}`, target_scheduled_at: parsed.data.scheduledAt ?? null, actor_kind: "telegram" });
  if (error) return NextResponse.json({ error: error.message.includes("version_conflict") ? "version_conflict" : error.message }, { status: error.message.includes("version_conflict") ? 409 : 400 });
  await supabase.from("approval_tokens").update({ used_at: new Date().toISOString() }).eq("id", token.id).is("used_at", null);
  return NextResponse.json({ article });
}

function safeJson(value: string) { try { return JSON.parse(value); } catch { return null; } }
