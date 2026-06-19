"use client";

import Link from "next/link";
import { useSitePreferences } from "@/lib/preferences";

export default function AdminCreateArticleLink() {
  const { locale } = useSitePreferences();
  return <Link href="/admin/articles/new">{locale === "ru" ? "Добавить вручную" : "Create manually"}</Link>;
}
