import { NextResponse } from "next/server";
import { publicationResultSchema } from "@/lib/editorial/schema";
import { verifyIntegrationSignature } from "@/lib/integrations/signature";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyIntegrationSignature(raw, request.headers.get("x-dens-signature"))) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  const parsed = publicationResultSchema.safeParse(safeJson(raw));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  const result = parsed.data;
  const { data: job, error: jobError } = await supabase.from("publication_jobs").update({ status: result.status, last_error: result.error ?? null, attempts: result.status === "failed" ? 1 : 0, updated_at: new Date().toISOString() }).eq("id", result.jobId).select("id,article_id,channel").single();
  if (jobError) return NextResponse.json({ error: jobError.message }, { status: 400 });
  if (result.status === "published") {
    await supabase.from("publications").insert({ article_id: job.article_id, job_id: job.id, channel: job.channel, external_id: result.externalId ?? null, external_url: result.externalUrl ?? null });

    const { count: unfinishedJobs } = await supabase
      .from("publication_jobs")
      .select("id", { count: "exact", head: true })
      .eq("article_id", job.article_id)
      .not("status", "in", "(published,cancelled)");

    if (unfinishedJobs === 0) {
      const { data: article } = await supabase.from("articles").select("version").eq("id", job.article_id).single();
      if (article) {
        await supabase.rpc("transition_article", {
          target_article_id: job.article_id,
          expected_version: article.version,
          target_status: "published",
          event_note: "All publication jobs completed",
          target_scheduled_at: null,
          actor_kind: "system",
        });
        await supabase.from("articles").update({ published_at: new Date().toISOString() }).eq("id", job.article_id);
      }
    }
  }
  return NextResponse.json({ ok: true });
}

function safeJson(value: string) { try { return JSON.parse(value); } catch { return null; } }
