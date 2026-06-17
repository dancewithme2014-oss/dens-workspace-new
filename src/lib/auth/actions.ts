"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { message: string; success: boolean };

export async function sendMagicLink(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { success: false, message: "Введите корректный email." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, message: "Supabase пока не настроен. Добавьте переменные окружения." };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/admin`, shouldCreateUser: false },
  });
  if (error) return { success: false, message: "Доступ разрешен только приглашенным редакторам." };
  return { success: true, message: "Ссылка для входа отправлена на email." };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
