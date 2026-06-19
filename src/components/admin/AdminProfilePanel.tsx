"use client";

import { useSitePreferences } from "@/lib/preferences";
import type { EditorialProfile } from "@/lib/editorial/types";

const copy = {
  ru: { fallback: "Редактор", owner: "Владелец", editor: "Редактор", active: "Активен", inactive: "Отключен", access: "Доступ", role: "Роль", id: "Profile ID" },
  en: { fallback: "Editor", owner: "Owner", editor: "Editor", active: "Active", inactive: "Inactive", access: "Access", role: "Role", id: "Profile ID" },
} as const;

export default function AdminProfilePanel({ profile }: { profile: EditorialProfile | null }) {
  const { locale } = useSitePreferences();
  const t = copy[locale];
  const name = profile?.displayName ?? profile?.email ?? t.fallback;
  return <section className="admin-panel admin-profile">
    <span>{name.slice(0, 2).toUpperCase()}</span>
    <div>
      <h2>{name}</h2>
      <p>{profile?.email}</p>
      <b>{profile?.role === "owner" ? t.owner : t.editor}</b>
      <dl className="admin-profile-health">
        <div><dt>{t.access}</dt><dd>{profile?.active ? t.active : t.inactive}</dd></div>
        <div><dt>{t.role}</dt><dd>{profile?.role ?? "editor"}</dd></div>
        <div><dt>{t.id}</dt><dd>{profile?.id ?? "n/a"}</dd></div>
      </dl>
    </div>
  </section>;
}
