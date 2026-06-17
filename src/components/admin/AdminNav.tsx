import Link from "next/link";
import { FileText, LayoutDashboard, Settings, UserRound } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import type { EditorialProfile } from "@/lib/editorial/types";

export default function AdminNav({ profile }: { profile: EditorialProfile }) {
  return <aside className="admin-nav">
    <Link className="admin-brand" href="/"><span>D</span><p>Den’s Workspace<small>Editorial OS</small></p></Link>
    <nav>
      <Link href="/admin"><LayoutDashboard/>Обзор</Link>
      <Link href="/admin/articles"><FileText/>Материалы</Link>
      <Link href="/admin/profile"><UserRound/>Профиль</Link>
      <Link href="/admin/settings"><Settings/>Настройки</Link>
    </nav>
    <div className="admin-user"><span>{(profile.displayName ?? profile.email).slice(0, 2).toUpperCase()}</span><p><strong>{profile.displayName ?? profile.email}</strong><small>{profile.role}</small></p><form action={signOut}><button type="submit">Выйти</button></form></div>
  </aside>;
}
