import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next") ?? "/admin";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/admin";
  const supabase = await createSupabaseServerClient();
  if (code && supabase) {
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (!sessionError && sessionData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role,active")
        .eq("id", sessionData.user.id)
        .maybeSingle();

      if (!profileError && profile?.active) {
        return NextResponse.redirect(new URL(next, url.origin));
      }

      console.error("Magic Link profile validation failed", {
        userId: sessionData.user.id,
        error: profileError?.message ?? "profile_missing_or_inactive",
      });
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL(`/admin/login?error=${profileError ? "profile_error" : "access_denied"}`, url.origin));
    }
  }
  return NextResponse.redirect(new URL("/admin/login?error=invalid_link", url.origin));
}
