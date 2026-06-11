"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowRight, ChevronDown, Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/content";

type Theme = "dark" | "light";

const navigation = {
  ru: ["Главная", "Проекты", "Исследования", "Новости", "Обо мне"],
  en: ["Home", "Projects", "Research", "News Feed", "About"],
} as const;

const destinations = ["/", "/projects", "/projects#research", "/projects#showcase", "/#about"];

export default function SiteHeader({ locale, setLocale, theme, setTheme, active = "home" }: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  active?: "home" | "projects";
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
      <nav className="desktop-nav">{labels.map((label, index) => <Link key={label} href={destinations[index]} className={(active === "home" && index === 0) || (active === "projects" && index === 1) ? "active" : ""}>{label}</Link>)}</nav>
      <div className="header-actions">
        <div className="desktop-preferences"><LanguageSelect locale={locale} setLocale={setLocale}/><ThemeSwitch locale={locale} theme={theme} setTheme={setTheme}/></div>
        <Link className="build-button" href="/#contact">{locale === "ru" ? "Обсудить проект" : "Let’s Build"}<ArrowRight size={15}/></Link>
      </div>
    </header>

    {menu && <aside className="mobile-menu site-menu">
      <div className="mobile-menu-head"><Link href="/" onClick={() => setMenu(false)}>Den’s Workspace</Link><button className="icon-button" onClick={() => setMenu(false)} aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"}><X size={22}/></button></div>
      <nav>{labels.map((label, index) => <Link key={label} href={destinations[index]} onClick={() => setMenu(false)}><span>0{index + 1}</span><strong>{label}</strong><ArrowDownRight/></Link>)}</nav>
      <div className="mobile-controls"><LanguageSelect locale={locale} setLocale={setLocale}/><ThemeSwitch locale={locale} theme={theme} setTheme={setTheme}/></div>
    </aside>}
  </>;
}

export function LanguageSelect({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  const [open, setOpen] = useState(false);
  const label = locale === "ru" ? "Выбрать язык" : "Select language";
  return <div className={`language-select-wrap ${open ? "open" : ""}`}>
    <button className="language-select" type="button" aria-label={label} aria-expanded={open} onClick={() => setOpen(value => !value)}>
      <Globe2/><span>{locale.toUpperCase()}</span><ChevronDown/>
    </button>
    {open && <div className="language-options" role="menu">
      {(["ru", "en"] as Locale[]).map(item => <button type="button" role="menuitem" className={item === locale ? "active" : ""} key={item} onClick={() => { setLocale(item); setOpen(false); }}>{item.toUpperCase()}</button>)}
    </div>}
  </div>;
}

export function ThemeSwitch({ locale, theme, setTheme }: { locale: Locale; theme: Theme; setTheme: (theme: Theme) => void }) {
  const isLight = theme === "light";
  const label = locale === "ru" ? (isLight ? "Включить темную тему" : "Включить светлую тему") : (isLight ? "Enable dark theme" : "Enable light theme");
  return <button className="theme-switch" type="button" role="switch" aria-checked={isLight} aria-label={label} onClick={() => setTheme(isLight ? "dark" : "light")}>
    <Moon className="theme-moon"/><Sun className="theme-sun"/><span/>
  </button>;
}
