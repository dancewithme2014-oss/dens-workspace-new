"use client";

import Link from "next/link";
import { Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSitePreferences } from "@/lib/preferences";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; updatedAt: string };
const key = "dw-cookie-consent-v1";

export default function CookieConsent() {
  const { locale } = useSitePreferences();
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const open = () => { setSettings(true); setVisible(true); };
    window.addEventListener("dw-open-cookie-settings", open);
    queueMicrotask(() => {
      try {
        const stored = window.localStorage.getItem(key);
        if (!stored) setVisible(true);
        else {
          const consent = JSON.parse(stored) as Consent;
          setAnalytics(Boolean(consent.analytics));
          setMarketing(Boolean(consent.marketing));
        }
      } catch { setVisible(true); }
      if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) {
        setAnalytics(false);
        setMarketing(false);
      }
    });
    return () => window.removeEventListener("dw-open-cookie-settings", open);
  }, []);

  const save = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const consent: Consent = { necessary: true, analytics: nextAnalytics, marketing: nextMarketing, updatedAt: new Date().toISOString() };
    try { window.localStorage.setItem(key, JSON.stringify(consent)); } catch {}
    window.dispatchEvent(new CustomEvent("dw-consent-change", { detail: consent }));
    setAnalytics(nextAnalytics); setMarketing(nextMarketing); setVisible(false); setSettings(false);
  };

  if (!visible) return null;
  const ru = locale === "ru";
  return <section className="cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
    <div className="cookie-icon"><Cookie/></div>
    <div className="cookie-copy">
      <h2 id="cookie-title">{ru ? "Ваш выбор конфиденциальности" : "Your privacy choices"}</h2>
      <p>{ru ? "Мы используем необходимые cookie для работы сайта. Аналитические и маркетинговые cookie включаются только с вашего согласия." : "We use necessary cookies to operate the site. Analytics and marketing cookies are enabled only with your consent."} <Link href="/privacy">{ru ? "Подробнее" : "Learn more"}</Link>.</p>
      {settings && <div className="cookie-settings">
        <label><span><b>{ru ? "Необходимые" : "Necessary"}</b><small>{ru ? "Всегда включены" : "Always on"}</small></span><input type="checkbox" checked disabled/></label>
        <label><span><b>{ru ? "Аналитика" : "Analytics"}</b><small>{ru ? "Помогает улучшать сайт" : "Helps improve the site"}</small></span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)}/></label>
        <label><span><b>{ru ? "Маркетинг" : "Marketing"}</b><small>{ru ? "Персонализация коммуникаций" : "Personalized communications"}</small></span><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)}/></label>
      </div>}
    </div>
    <div className="cookie-actions">
      {settings ? <button className="cookie-primary" onClick={() => save(analytics, marketing)}>{ru ? "Сохранить выбор" : "Save choices"}</button> : <button onClick={() => setSettings(true)}><Settings2/>{ru ? "Настроить" : "Settings"}</button>}
      <button onClick={() => save(false, false)}>{ru ? "Только необходимые" : "Necessary only"}</button>
      <button className="cookie-primary" onClick={() => save(true, true)}>{ru ? "Принять все" : "Accept all"}</button>
    </div>
    <button className="cookie-close" aria-label={ru ? "Закрыть" : "Close"} onClick={() => save(false, false)}><X/></button>
  </section>;
}
