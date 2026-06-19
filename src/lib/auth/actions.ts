"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { message: string; success: boolean; email?: string };

export async function sendMagicLink(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { success: false, message: "Введите корректный email.", email };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, message: "Supabase пока не настроен. Добавьте переменные окружения.", email };
  const siteUrl = await getRequestOrigin();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/admin`, shouldCreateUser: false },
  });
  if (error) return { success: false, message: "Доступ разрешен только приглашенным редакторам.", email };
  return { success: true, message: "Ссылка для входа отправлена на email.", email };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  if (host) return `${protocol}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
