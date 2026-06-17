"use client";

import { useSitePreferences } from "@/lib/preferences";

export default function AdminSettings() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  return <section className="admin-panel admin-settings"><div><h2>Язык интерфейса</h2><p>Настройка применяется ко всему сайту и редакционной панели.</p><div className="admin-segment"><button className={locale === "ru" ? "active" : ""} onClick={() => setLocale("ru")}>Русский</button><button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>English</button></div></div><div><h2>Тема</h2><p>Выбор сохраняется в браузере.</p><div className="admin-segment"><button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>Темная</button><button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>Светлая</button></div></div><div><h2>Публикация</h2><p>Сайт и Telegram включены в первую версию. X, Reddit и Threads подключаются через независимые адаптеры n8n.</p></div></section>;
}
