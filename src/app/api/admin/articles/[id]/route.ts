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
  const { data: existingArticle } = await supabase.from("articles").select("id").eq("id", id).maybeSingle();
  if (existingArticle) {
    const { data, error } = await supabase.rpc("save_article_localization", {
    target_article_id: id,
    expected_version: payload.expectedVersion,
    target_locale: payload.locale,
    payload: { ...payload, slug, translationStatus: "reviewed" },
  });
    if (error) return NextResponse.json({ error: error.message.includes("version_conflict") ? "version_conflict" : error.message }, { status: error.message.includes("version_conflict") ? 409 : 400 });
    return NextResponse.json({ article: data });
  }

  if (payload.locale !== "ru") return NextResponse.json({ error: "editorial_drafts_support_ru_only" }, { status: 400 });
  const { data: draft, error: draftError } = await supabase
    .from("editorial_drafts")
    .update({
      slug,
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      category: payload.category,
      tags: payload.tags,
      seo_title: payload.seoTitle,
      seo_description: payload.seoDescription,
      telegram_text: payload.telegramText,
      version: payload.expectedVersion + 1,
    })
    .eq("id", id)
    .eq("version", payload.expectedVersion)
    .select("id,status,version")
    .maybeSingle();
  if (draftError) return NextResponse.json({ error: draftError.message }, { status: 400 });
  if (!draft) return NextResponse.json({ error: "version_conflict" }, { status: 409 });
  return NextResponse.json({ article: draft });
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
    .select("id,status,version")
    .maybeSingle();
  if (draftError) return NextResponse.json({ error: draftError.message }, { status: 400 });
  if (!draft) return NextResponse.json({ error: "version_conflict" }, { status: 409 });
  return NextResponse.json({ article: draft });
}
