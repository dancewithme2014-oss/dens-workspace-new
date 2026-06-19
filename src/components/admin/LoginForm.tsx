"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Inbox, Mail, RotateCcw, ShieldCheck } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { sendMagicLink, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = { message: "", success: false };

export default function LoginForm({ initialError = "" }: { initialError?: string }) {
  const [editingEmail, setEditingEmail] = useState(false);
  const [state, action, pending] = useActionState(sendMagicLink, {
    ...initialState,
    message: initialError,
  });
  const showSentState = state.success && !editingEmail && !pending;

  useEffect(() => {
    if (!showSentState) return;
    let active = true;
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json();
        if (active && data.profile) window.location.assign("/admin");
      } catch {}
    };
    checkSession();
    const interval = window.setInterval(checkSession, 3500);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [showSentState]);

  if (showSentState) {
    return <div className="admin-login-sent">
      <span><Inbox/></span>
      <h2>Проверьте почту</h2>
      <p>Мы отправили одноразовую ссылку на <strong>{state.email}</strong>. Откройте письмо и нажмите <b>Sign In</b>.</p>
      <ol>
        <li><CheckCircle2/>Эта вкладка сама перейдет в админку, если вход завершится в другом окне.</li>
        <li><ShieldCheck/>Ссылка одноразовая и действует ограниченное время.</li>
      </ol>
      <div className="admin-login-sent-actions">
        <Link href="/admin">Открыть админку<ArrowRight/></Link>
        <form className="admin-login-resend-form" action={action}>
          <input type="hidden" name="email" value={state.email ?? ""}/>
          <button type="submit" disabled={pending}><RotateCcw/>{pending ? "Отправка..." : "Отправить еще раз"}</button>
        </form>
      </div>
      <button className="admin-login-change" type="button" onClick={() => setEditingEmail(true)}>Войти с другим email</button>
    </div>;
  }

  return <form action={action} className="admin-login-form" onSubmit={() => setEditingEmail(false)}>
    <label htmlFor="admin-email">Email редактора</label>
    <div><Mail/><input id="admin-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" defaultValue={state.email ?? ""} required/></div>
    <button type="submit" disabled={pending}>{pending ? "Отправка…" : "Получить ссылку"}<ArrowRight/></button>
    {state.message && <p className={state.success ? "success" : "error"}>{state.message}</p>}
  </form>;
}
