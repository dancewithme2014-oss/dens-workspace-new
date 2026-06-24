"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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
  const pathname = usePathname();
  const t = copy[locale];
  const links = [
    ["/admin", LayoutDashboard, t.overview],
    ["/admin/articles", FileText, t.articles],
    ["/admin/profile", UserRound, t.profile],
    ["/admin/settings", Settings, t.settings],
  ] as const;

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return <aside className="admin-nav">
    <Link className="admin-brand" href="/"><span>D</span><p>Den Workspace<small>Editorial OS</small></p></Link>
    <nav>
      {links.map(([href, Icon, label]) => {
        const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return <Link key={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} href={href}><Icon/>{label}</Link>;
      })}
    </nav>
    <div className="admin-user"><span>{(profile.displayName ?? profile.email).slice(0, 2).toUpperCase()}</span><p><strong>{profile.displayName ?? profile.email}</strong><small>{profile.role}</small></p><form action={signOut}><button type="submit">{t.signOut}</button></form></div>
  </aside>;
}
