"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/content";

type Theme = "dark" | "light";
const preferenceEvent = "dw-preferences-change";

function applyDocumentPreferences(locale: Locale, theme: Theme) {
  document.documentElement.lang = locale;
  document.documentElement.dataset.theme = theme;
}

export function useSitePreferences() {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => {
      try {
        const nextLocale = window.localStorage.getItem("dw-locale") === "en" ? "en" : "ru";
        const nextTheme = window.localStorage.getItem("dw-theme") === "light" ? "light" : "dark";
        setLocaleState(nextLocale);
        setThemeState(nextTheme);
        applyDocumentPreferences(nextLocale, nextTheme);
      } catch {
        setLocaleState("ru");
        setThemeState("dark");
        applyDocumentPreferences("ru", "dark");
      }
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(preferenceEvent, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(preferenceEvent, sync);
    };
  }, []);

  const setLocale = useCallback((value: Locale) => {
    setLocaleState(value);
    applyDocumentPreferences(value, theme);
    try { window.localStorage.setItem("dw-locale", value); } catch {}
    window.dispatchEvent(new Event(preferenceEvent));
  }, [theme]);
  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    applyDocumentPreferences(locale, value);
    try { window.localStorage.setItem("dw-theme", value); } catch {}
    window.dispatchEvent(new Event(preferenceEvent));
  }, [locale]);

  return { locale, theme, setLocale, setTheme };
}
