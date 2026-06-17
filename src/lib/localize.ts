import type { Locale } from "@/lib/content";

export function localizeAi(text: string, locale: Locale) {
  if (locale !== "ru") return text;
  return text.replace(/Human-AI/g, "Человек–ИИ").replace(/\bAI\b/g, "ИИ").replace(/AI-/g, "ИИ-");
}
