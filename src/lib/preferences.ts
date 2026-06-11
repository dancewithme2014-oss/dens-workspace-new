"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/content";

type Theme = "dark" | "light";
const listeners = new Set<() => void>();
const serverSnapshot = "ru|dark";

function readSnapshot() {
  if (typeof window === "undefined") return serverSnapshot;
  const locale = localStorage.getItem("dw-locale") === "en" ? "en" : "ru";
  const theme = localStorage.getItem("dw-theme") === "light" ? "light" : "dark";
  return `${locale}|${theme}`;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function notify() {
  listeners.forEach(listener => listener());
}

export function useSitePreferences() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => serverSnapshot);
  const [locale, theme] = snapshot.split("|") as [Locale, Theme];

  const setLocale = (value: Locale) => {
    localStorage.setItem("dw-locale", value);
    notify();
  };
  const setTheme = (value: Theme) => {
    localStorage.setItem("dw-theme", value);
    notify();
  };

  return { locale, theme, setLocale, setTheme };
}
