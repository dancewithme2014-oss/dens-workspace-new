"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = { message: "", success: false };

export default function LoginForm({ initialError = "" }: { initialError?: string }) {
  const [state, action, pending] = useActionState(sendMagicLink, {
    ...initialState,
    message: initialError,
  });
  return <form action={action} className="admin-login-form">
    <label htmlFor="admin-email">Email редактора</label>
    <div><Mail/><input id="admin-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required/></div>
    <button type="submit" disabled={pending}>{pending ? "Отправка…" : "Получить ссылку"}<ArrowRight/></button>
    {state.message && <p className={state.success ? "success" : "error"}>{state.message}</p>}
  </form>;
}
