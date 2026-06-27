"use client";

import Link from "next/link";
import { useSitePreferences } from "@/lib/preferences";
import { LanguageSelect, ThemeSwitch } from "@/components/SiteHeader";

export default function SiteFooter() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const openCookies = () => window.dispatchEvent(new Event("dw-open-cookie-settings"));

  return <footer className="site-footer shell">
    <span>© 2026 Den Workspace</span>
    <nav>
      <Link href="/privacy"><span className="footer-label-desktop">{locale === "ru" ? "Обработка персональных данных" : "Privacy Policy"}</span><span className="footer-label-mobile">{locale === "ru" ? "Политика" : "Privacy"}</span></Link>
      <button type="button" onClick={openCookies}><span className="footer-label-desktop">{locale === "ru" ? "Настройки cookie" : "Cookie settings"}</span><span className="footer-label-mobile">Cookie</span></button>
    </nav>
    <div className="site-footer-aside">
      <div className="site-footer-controls">
        <LanguageSelect locale={locale} setLocale={setLocale}/>
        <ThemeSwitch locale={locale} theme={theme} setTheme={setTheme}/>
      </div>
      <span className="site-status"><i/>{locale === "ru" ? "Работает" : "Operational"}</span>
    </div>
  </footer>;
}
