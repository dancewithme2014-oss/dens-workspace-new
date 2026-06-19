"use client";

import type { ReactNode } from "react";
import { useSitePreferences } from "@/lib/preferences";

type Text = { ru: string; en: string };

export default function AdminHeading({ eyebrow, title, children }: { eyebrow: string | Text; title: Text; children?: ReactNode }) {
  const { locale } = useSitePreferences();
  const eyebrowText = typeof eyebrow === "string" ? eyebrow : eyebrow[locale];
  return <header className="admin-heading"><div><p>{eyebrowText}</p><h1>{title[locale]}<i/></h1></div>{children}</header>;
}
