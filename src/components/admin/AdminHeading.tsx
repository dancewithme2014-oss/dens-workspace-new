"use client";

import type { ReactNode } from "react";
import { useSitePreferences } from "@/lib/preferences";

type Text = { ru: string; en: string };

export default function AdminHeading({ eyebrow, title, children }: { eyebrow: string; title: Text; children?: ReactNode }) {
  const { locale } = useSitePreferences();
  return <header className="admin-heading"><div><p>{eyebrow}</p><h1>{title[locale]}<i/></h1></div>{children}</header>;
}
