"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/content";

type Theme = "dark" | "light";
const preferenceEvent = "dw-preferences-change";

export function useSitePreferences() {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const sync = () => {
      try {
        setLocaleState(window.localStorage.getItem("dw-locale") === "en" ? "en" : "ru");
        setThemeState(window.localStorage.getItem("dw-theme") === "light" ? "light" : "dark");
      } catch {
        setLocaleState("ru");
        setThemeState("dark");
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
    try { window.localStorage.setItem("dw-locale", value); } catch {}
    window.dispatchEvent(new Event(preferenceEvent));
  }, []);
  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    try { window.localStorage.setItem("dw-theme", value); } catch {}
    window.dispatchEvent(new Event(preferenceEvent));
  }, []);

  return { locale, theme, setLocale, setTheme };
}
