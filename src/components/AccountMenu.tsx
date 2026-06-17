"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth/actions";
import type { EditorialProfile } from "@/lib/editorial/types";
import type { Locale } from "@/lib/content";

export default function AccountMenu({ locale, onNavigate }: { locale: Locale; onNavigate?: () => void }) {
  const [profile, setProfile] = useState<EditorialProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(response => response.json())
      .then(data => { if (active) setProfile(data.profile ?? null); })
      .catch(() => {})
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);

  if (!loaded) return <div className="account-menu account-loading" aria-hidden="true"/>;
  if (!profile) {
    return <div className="account-menu">
      <Link href="/admin/login" onClick={onNavigate}><LogIn/><span>{locale === "ru" ? "Войти" : "Log In"}</span><small>{locale === "ru" ? "Редакционная панель" : "Editorial workspace"}</small></Link>
    </div>;
  }

  return <div className="account-menu">
    <div className="account-identity"><span>{profile.avatarUrl ? <Image src={profile.avatarUrl} alt="" width={36} height={36} unoptimized/> : (profile.displayName ?? profile.email).slice(0, 2).toUpperCase()}</span><p><strong>{profile.displayName ?? profile.email}</strong><small>{profile.role === "owner" ? (locale === "ru" ? "Владелец" : "Owner") : (locale === "ru" ? "Редактор" : "Editor")}</small></p></div>
    <Link href="/admin" onClick={onNavigate}><ShieldCheck/><span>{locale === "ru" ? "Админ-панель" : "Admin Panel"}</span></Link>
    <Link href="/admin/profile" onClick={onNavigate}><UserRound/><span>{locale === "ru" ? "Профиль" : "Profile"}</span></Link>
    <Link href="/admin/settings" onClick={onNavigate}><Settings/><span>{locale === "ru" ? "Настройки" : "Settings"}</span></Link>
    <form action={signOut}><button type="submit"><LogOut/><span>{locale === "ru" ? "Выйти" : "Log Out"}</span></button></form>
  </div>;
}
