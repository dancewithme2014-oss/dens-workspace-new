"use client";

import Link from "next/link";
import { useSitePreferences } from "@/lib/preferences";

export default function SiteFooter() {
  const { locale } = useSitePreferences();
  const openCookies = () => window.dispatchEvent(new Event("dw-open-cookie-settings"));

  return <footer className="site-footer shell">
    <span>© 2026 Den Workspace</span>
    <nav>
      <Link href="/privacy"><span className="footer-label-desktop">{locale === "ru" ? "Обработка персональных данных" : "Privacy Policy"}</span><span className="footer-label-mobile">{locale === "ru" ? "Политика" : "Privacy"}</span></Link>
      <button type="button" onClick={openCookies}><span className="footer-label-desktop">{locale === "ru" ? "Настройки cookie" : "Cookie settings"}</span><span className="footer-label-mobile">Cookie</span></button>
    </nav>
    <span className="site-status"><i/>{locale === "ru" ? "Работает" : "Operational"}</span>
  </footer>;
}
