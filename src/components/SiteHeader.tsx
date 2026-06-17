"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, ChevronDown, Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/content";
import AccountMenu from "@/components/AccountMenu";

type Theme = "dark" | "light";

const navigation = {
  ru: ["Главная", "Проекты", "Исследования", "Новости", "Обо мне"],
  en: ["Home", "Projects", "Research", "News Feed", "About"],
} as const;

const destinations = ["/", "/projects", "/research", "/news-feed", "/about"];

export default function SiteHeader({ locale, setLocale, theme, setTheme, active = "home" }: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  active?: "home" | "projects" | "research" | "news" | "about";
}) {
  const [menu, setMenu] = useState(false);
  const labels = navigation[locale];

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  return <>
    <header className="header shell site-header">
      <div className="header-identity">
        <button className="icon-button menu-trigger" aria-label={locale === "ru" ? "Открыть меню" : "Open menu"} onClick={() => setMenu(true)}><Menu size={20}/></button>
        <Link className="brand" href="/">Den’s Workspace</Link>
      </div>
      <nav className="desktop-nav">{labels.map((label, index) => <Link key={label} href={destinations[index]} className={(active === "home" && index === 0) || (active === "projects" && index === 1) || (active === "research" && index === 2) || (active === "news" && index === 3) || (active === "about" && index === 4) ? "active" : ""}>{label}</Link>)}</nav>
      <div className="header-actions">
        <div className="desktop-preferences"><LanguageSelect locale={locale} setLocale={setLocale}/><ThemeSwitch locale={locale} theme={theme} setTheme={setTheme}/></div>
        <Link className="build-button" href="/#start-conversation"><span className="build-label-desktop">{locale === "ru" ? "Обсудить проект" : "Let’s Build"}</span><span className="build-label-mobile">Let’s Build</span><ArrowRight size={15}/></Link>
      </div>
    </header>

    {menu && <aside className="mobile-menu site-menu">
      <div className="mobile-menu-head"><Link href="/" onClick={() => setMenu(false)}>Den’s Workspace</Link><button className="icon-button" onClick={() => setMenu(false)} aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"}><X size={22}/></button></div>
      <nav>{labels.map((label, index) => <Link key={label} href={destinations[index]} onClick={() => setMenu(false)}><span>0{index + 1}</span><strong>{label}</strong><ArrowDownRight/></Link>)}</nav>
      <div className="mobile-account"><AccountMenu locale={locale} onNavigate={() => setMenu(false)}/></div>
    </aside>}
  </>;
}

export function LanguageSelect({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  const label = locale === "ru" ? "Выбрать язык" : "Select language";

  return <div className="language-select-wrap">
    <Globe2 className="language-leading" aria-hidden="true"/>
    <span aria-hidden="true">{locale.toUpperCase()}</span>
    <select className="language-select" aria-label={label} value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
      <option value="ru">RU</option>
      <option value="en">EN</option>
    </select>
    <ChevronDown className="language-chevron" aria-hidden="true"/>
  </div>;
}

export function ThemeSwitch({ locale, theme, setTheme }: { locale: Locale; theme: Theme; setTheme: (theme: Theme) => void }) {
  const isLight = theme === "light";
  const label = locale === "ru" ? (isLight ? "Включить темную тему" : "Включить светлую тему") : (isLight ? "Enable dark theme" : "Enable light theme");
  return <button className="theme-switch" type="button" role="switch" aria-checked={isLight} aria-label={label} onClick={() => setTheme(isLight ? "dark" : "light")}>
    <Moon className="theme-moon"/><Sun className="theme-sun"/><span/>
  </button>;
}
