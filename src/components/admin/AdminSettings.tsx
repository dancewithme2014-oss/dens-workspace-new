"use client";

import { useSitePreferences } from "@/lib/preferences";

const copy = {
  ru: {
    language: "Язык интерфейса",
    languageHint: "Настройка применяется ко всему сайту и редакционной панели.",
    theme: "Тема",
    themeHint: "Выбор сохраняется в браузере.",
    dark: "Темная",
    light: "Светлая",
    publishing: "Публикация",
    publishingHint: "Сайт читает опубликованные материалы из Supabase. Telegram и другие каналы подключаются отдельными workflow.",
  },
  en: {
    language: "Interface language",
    languageHint: "This setting applies to the website and editorial workspace.",
    theme: "Theme",
    themeHint: "Your choice is saved in this browser.",
    dark: "Dark",
    light: "Light",
    publishing: "Publishing",
    publishingHint: "The site reads published materials from Supabase. Telegram and other channels are handled by separate workflows.",
  },
} as const;

export default function AdminSettings() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const t = copy[locale];
  return <section className="admin-panel admin-settings">
    <div><h2>{t.language}</h2><p>{t.languageHint}</p><div className="admin-segment"><button className={locale === "ru" ? "active" : ""} onClick={() => setLocale("ru")}>Русский</button><button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>English</button></div></div>
    <div><h2>{t.theme}</h2><p>{t.themeHint}</p><div className="admin-segment"><button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>{t.dark}</button><button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>{t.light}</button></div></div>
    <div><h2>{t.publishing}</h2><p>{t.publishingHint}</p></div>
  </section>;
}
