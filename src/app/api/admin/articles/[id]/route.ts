import { NextResponse } from "next/server";
import { articleUpdateSchema, transitionSchema } from "@/lib/editorial/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const parsed = articleUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });

  const payload = parsed.data;
  const slug = payload.slug || `${payload.locale}-${id}`;
  const { data, error } = await supabase.rpc("save_article_localization", {
    target_article_id: id,
    expected_version: payload.expectedVersion,
    target_locale: payload.locale,
    payload: { ...payload, slug, translationStatus: "reviewed" },
  });
  if (error) return NextResponse.json({ error: error.message.includes("version_conflict") ? "version_conflict" : error.message }, { status: error.message.includes("version_conflict") ? 409 : 400 });
  return NextResponse.json({ article: data });
}

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  const parsed = transitionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
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
