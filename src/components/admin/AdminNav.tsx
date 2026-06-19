"use client";

import Link from "next/link";
import { FileText, LayoutDashboard, Settings, UserRound } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { useSitePreferences } from "@/lib/preferences";
import type { EditorialProfile } from "@/lib/editorial/types";

const copy = {
  ru: { overview: "Обзор", articles: "Материалы", profile: "Профиль", settings: "Настройки", signOut: "Выйти" },
  en: { overview: "Overview", articles: "Articles", profile: "Profile", settings: "Settings", signOut: "Sign out" },
} as const;

export default function AdminNav({ profile }: { profile: EditorialProfile }) {
  const { locale } = useSitePreferences();
  const t = copy[locale];
  return <aside className="admin-nav">
    <Link className="admin-brand" href="/"><span>D</span><p>Den Workspace<small>Editorial OS</small></p></Link>
    <nav>
      <Link href="/admin"><LayoutDashboard/>{t.overview}</Link>
      <Link href="/admin/articles"><FileText/>{t.articles}</Link>
      <Link href="/admin/profile"><UserRound/>{t.profile}</Link>
      <Link href="/admin/settings"><Settings/>{t.settings}</Link>
    </nav>
    <div className="admin-user"><span>{(profile.displayName ?? profile.email).slice(0, 2).toUpperCase()}</span><p><strong>{profile.displayName ?? profile.email}</strong><small>{profile.role}</small></p><form action={signOut}><button type="submit">{t.signOut}</button></form></div>
  </aside>;
}
