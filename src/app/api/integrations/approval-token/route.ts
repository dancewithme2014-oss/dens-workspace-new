import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { approvalTokenSchema } from "@/lib/editorial/schema";
import { verifyIntegrationSignature } from "@/lib/integrations/signature";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyIntegrationSignature(raw, request.headers.get("x-dens-signature"))) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  const parsed = approvalTokenSchema.safeParse(safeJson(raw));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  const token = randomBytes(24).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { error } = await supabase.from("approval_tokens").insert({ article_id: parsed.data.articleId, article_version: parsed.data.articleVersion, action: parsed.data.action, token_hash: tokenHash });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ token, expiresInSeconds: 86400 });
}

function safeJson(value: string) { try { return JSON.parse(value); } catch { return null; } }
