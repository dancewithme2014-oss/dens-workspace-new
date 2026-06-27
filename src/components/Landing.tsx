"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowRight, AudioLines, Bot, BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, ChartPie, Check, Clock3, CloudCog, Database, Eye, FileText, Globe2, Mail, Megaphone, MessageSquareText, Network, PenLine, PhoneOff, Rocket, Sparkles, Workflow } from "lucide-react";
import { content, newsItems, solutions, workItems } from "@/lib/content";
import type { PortfolioProject } from "@/lib/projects-data";
import SiteHeader from "@/components/SiteHeader";
import AmbientBackground from "@/components/AmbientBackground";
import LoopingVideo from "@/components/LoopingVideo";
import { useSitePreferences } from "@/lib/preferences";
import { localizeAi } from "@/lib/localize";
import { defaultPhoneCountry, findPhoneCountry, phoneCountries } from "@/lib/phone-countries";

const iconMap = { phone: PhoneOff, audio: AudioLines, chart: ChartNoAxesCombined, file: FileText, workflow: Workflow, clock: Clock3, database: Database, pie: ChartPie, eye: Eye, megaphone: Megaphone, pen: PenLine, rocket: Rocket };
const workIcons = [CloudCog, BriefcaseBusiness, Bot, Network];
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const requestTypes = [
  { value: "ai-automation", ru: "ИИ автоматизация", en: "AI Automation" },
  { value: "business-system", ru: "Бизнес-система", en: "Business System" },
  { value: "ai-agent", ru: "ИИ-агент", en: "AI Agent" },
  { value: "consulting", ru: "Консалтинг", en: "Consulting" },
  { value: "collaboration", ru: "Сотрудничество", en: "Collaboration" },
  { value: "other", ru: "Другое", en: "Other" },
] as const;

export default function Landing({ projects }: { projects: PortfolioProject[] }) {
  const router = useRouter();
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<"idle" | "loading" | "ready" | "error">(turnstileSiteKey ? "loading" : "ready");
  const [turnstileRetryKey, setTurnstileRetryKey] = useState(0);
  const [phoneCountry, setPhoneCountry] = useState(defaultPhoneCountry);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [showDesktopHeroMedia, setShowDesktopHeroMedia] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const t = content[locale];
  const langIndex = locale === "ru" ? 0 : 1;
  const localizedWorkItems = locale === "ru" ? [
    ["ИИ-автоматизация", "В работе"],
    ["Бизнес-системы", "Тестирование"],
    ["Экосистема ИИ-агентов", "Разработка"],
    ["Интеграция робототехники", "Исследование"],
  ] : workItems;
  const localizedNewsItems = locale === "ru" ? [
    ["Новая модель рассуждений для сложных задач", "2 мин"],
    ["Гуманоидный робот проходит реальные испытания", "15 мин"],
    ["ИИ-агенты переходят от демо к операциям", "32 мин"],
    ["Robotics VLA объединяет зрение и действие", "1 ч"],
    ["Автоматизация становится инфраструктурой", "2 ч"],
  ] : newsItems;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const update = () => setShowDesktopHeroMedia(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let active = true;
    const detectCountry = async () => {
      let code = "";
      try {
        const response = await fetch("/api/country", { cache: "no-store" });
        if (response.ok) code = String((await response.json()).country || "");
      } catch {}
      if (!code) code = navigator.language.split("-")[1] || "";
      const detected = findPhoneCountry(code);
      if (active && detected) setPhoneCountry(detected);
    };
    detectCountry();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    const updateBackground = () => {
      frame = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(window.scrollY / maxScroll, 1);
      document.documentElement.style.setProperty("--ambient-scroll", `${progress * 140}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateBackground);
    };

    updateBackground();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--ambient-scroll");
    };
  }, []);
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;
    let fallbackTimer = 0;
    setTurnstileStatus("loading");

    const safeRemoveTurnstile = () => {
      if (!window.turnstile || !turnstileWidgetId.current) return;
      try {
        window.turnstile.remove(turnstileWidgetId.current);
      } catch {}
      turnstileWidgetId.current = null;
    };

    const failTurnstile = () => {
      setTurnstileToken("");
      setTurnstileStatus("error");
    };

    const renderTurnstile = () => {
      if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileStatus("ready");
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setTurnstileStatus("loading");
        },
        "error-callback": failTurnstile,
      });
      window.clearTimeout(fallbackTimer);
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      const script = existingScript ?? document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      script.onerror = failTurnstile;
      if (!existingScript) document.head.appendChild(script);
    }
    fallbackTimer = window.setTimeout(() => {
      if (!turnstileWidgetId.current) failTurnstile();
    }, 8000);

    return () => {
      window.clearTimeout(fallbackTimer);
      safeRemoveTurnstile();
      setTurnstileToken("");
    };
  }, [theme, turnstileRetryKey]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (turnstileSiteKey && !turnstileToken) {
      setTurnstileStatus("error");
      setFormState("error");
      return;
    }
    setFormState("loading");
    const fd = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), phoneCountry: phoneCountry.code, phone: phoneDigits, requestType: fd.get("requestType"), message: fd.get("message"), website: fd.get("website"), turnstileToken, locale }) });
    setFormState(response.ok ? "success" : "error");
    if (turnstileStatus === "ready" && window.turnstile && turnstileWidgetId.current) {
      try {
        window.turnstile.reset(turnstileWidgetId.current);
      } catch {}
      setTurnstileToken("");
    }
    if (response.ok) {
      event.currentTarget.reset();
      setPhoneDigits("");
    }
  };

  return <main>
    <AmbientBackground/>
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="home"/>

    <section className="hero shell" id="top">
      <div className="hero-copy">
        <p className="hero-eyebrow"><i/>{locale === "ru" ? "ИИ для бизнеса" : "AI for Business"}</p>
        <h1>{t.heroTitle}</h1>
        <p className="kicker">{t.kicker}</p>
        <p className="intro">{t.intro}</p>
        <div className="hero-buttons hero-buttons-desktop"><button className="primary" onClick={() => router.push("/projects")}>{t.explore}<ArrowDownRight/></button><button className="text-button" onClick={() => scrollTo("ai-business")}>{t.work}<i/></button></div>
        <div className="hero-mobile-stage">
          <div className="hero-mobile-art" aria-hidden="true">
            <Image className="theme-art theme-art-dark" src="/landing/hero-robot-dark.webp" alt="" fill sizes="100vw" priority/>
            <Image className="theme-art theme-art-light" src="/landing/hero-robot-light.webp" alt="" fill sizes="100vw" priority/>
          </div>
          <div className="hero-buttons hero-buttons-mobile"><button className="primary" onClick={() => router.push("/projects")}>{t.explore}<ArrowDownRight/></button><button className="text-button" onClick={() => scrollTo("ai-business")}>{t.work}<i/></button></div>
        </div>
      </div>
      <div className="hero-image" aria-hidden="true">
        <div className="hero-media-desktop">
          {showDesktopHeroMedia && <>
            <LoopingVideo key={theme} src={theme === "dark" ? "/landing/hero-robot-dark.mp4" : "/landing/hero-robot-light.mp4"}/>
            <span className="video-corner-mask" aria-hidden="true" />
          </>}
        </div>
        <div className="hero-media-mobile">
          <Image className="theme-art theme-art-dark" src="/landing/hero-robot-dark.webp" alt="" width={1672} height={940} sizes="100vw" loading="eager"/>
          <Image className="theme-art theme-art-light" src="/landing/hero-robot-light.webp" alt="" width={1673} height={940} sizes="100vw" loading="eager"/>
        </div>
      </div>
      <div className="hero-panels">
        <InfoPanel title={t.working} items={localizedWorkItems} icons={workIcons} action={t.allExperiments} onAction={() => router.push("/research#experiments")} locale={locale}/>
        <InfoPanel title={t.news} items={localizedNewsItems} action={t.allNews} onAction={() => router.push("/news-feed")} locale={locale}/>
      </div>
    </section>

    <section className="section shell" id="projects">
      <SectionHead eyebrow={t.featured} title={t.projectsTitle} action={t.allProjects} onAction={() => router.push("/projects")}/>
      <div className="projects-row">{projects.map((project) => <button type="button" className="project-card" key={project.number} onClick={() => router.push(`/projects?project=${project.architectureId}#showcase`)}><span>{project.number}</span><div className="project-image"><Image src={project.image} alt={project.name} fill sizes="(max-width: 700px) 78vw, 20vw"/></div><h3>{project.name}</h3><p>{locale === "ru" ? ({ "Live Commerce Platform": "Платформа live-commerce", "AI Consulting Platform": "Платформа ИИ-консалтинга", "AI Operating System": "Операционная ИИ-система", "Inventory Intelligence": "Интеллектуальное управление складом", "Content Automation": "Автоматизация контента" } as Record<string, string>)[project.subtitle] ?? localizeAi(project.subtitle, locale) : project.subtitle}</p><b>{locale === "ru" ? "Активен" : project.status}</b></button>)}</div>
    </section>

    <section className="section shell" id="ai-business">
      <SectionHead eyebrow={t.business} title={t.businessTitle}/>
      <div className="solutions">{solutions.map((row) => <article className="solution-row" key={row.p[1]}>{[0,1,2].map((cell) => {
        const values = cell === 0 ? [row.p, row.pd] : cell === 1 ? [row.s, row.sd] : [row.r, row.rd]; const Icon = iconMap[row.icons[cell] as keyof typeof iconMap];
        return <div className="solution-cell" key={cell}><div className={`solution-icon ${cell === 2 ? "yellow" : ""}`}><Icon/></div><div><h3>{values[0][langIndex]}</h3><p>{values[1][langIndex]}</p></div>{cell < 2 && <ArrowRight className="flow"/>}</div>;
      })}</article>)}</div>
    </section>

    <section className="contact section shell" id="contact">
      <div className="contact-copy" id="about"><b>{t.contactNumber}</b><h2>{t.contactTitle}<strong>{t.contactAccent}<i/></strong></h2><p>{t.contactText}</p><i/><p>{t.contactNote}</p></div>
      <figure className="portrait"><div><Image src="/landing/den-portrait-footer-bw.jpg" alt="Den" fill sizes="(max-width: 700px) 92vw, 22vw"/></div><figcaption><MessageSquareText/><p>{t.quote}</p><b>— Den Workspace</b></figcaption></figure>
      <div className="contact-panel">
        <div className="contact-info" id="start-conversation"><h3>{t.conversation}</h3><p>{t.conversationText}</p><ul><ContactItem icon={Mail} title="Email" text="hello@densworkspace.com"/><ContactItem icon={CalendarDays} title={locale === "ru" ? "Созвон" : "Schedule a Call"} text={locale === "ru" ? "Стратегическая сессия" : "Book a strategy session"}/><ContactItem icon={Clock3} title={locale === "ru" ? "Время ответа" : "Response Time"} text={locale === "ru" ? "Моментально" : "Instantly"}/><ContactItem icon={Globe2} title={locale === "ru" ? "Локация" : "Location"} text={locale === "ru" ? "Весь мир · Удаленно" : "Global · Remote"}/></ul></div>
        <form onSubmit={submit}>
          <label>{t.name}<input name="name" required minLength={2} placeholder={locale === "ru" ? "Ваше имя" : "John Doe"}/></label>
          <label>{t.email}<input name="email" required type="email" placeholder="john@company.com"/></label>
          <label className="phone-label">{locale === "ru" ? "Телефон" : "Phone"}<span className="phone-field"><select aria-label={locale === "ru" ? "Код страны" : "Country code"} value={phoneCountry.code} onChange={(event) => { const next = findPhoneCountry(event.target.value) ?? defaultPhoneCountry; setPhoneCountry(next); setPhoneDigits(""); }}>{phoneCountries.map(country => <option key={country.code} value={country.code}>{country.dial} · {country[locale]}</option>)}</select><input name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required minLength={phoneCountry.min} maxLength={phoneCountry.max} pattern={`[0-9]{${phoneCountry.min},${phoneCountry.max}}`} value={phoneDigits} onChange={(event) => setPhoneDigits(event.target.value.replace(/\D/g, "").slice(0, phoneCountry.max))} placeholder={phoneCountry.min === phoneCountry.max ? `${phoneCountry.min} ${locale === "ru" ? "цифр" : "digits"}` : `${phoneCountry.min}–${phoneCountry.max} ${locale === "ru" ? "цифр" : "digits"}`}/></span></label>
          <label>{t.type}<select name="requestType" required defaultValue=""><option value="" disabled>{locale === "ru" ? "Выберите вариант" : "Select an option"}</option>{requestTypes.map(option => <option value={option.value} key={option.value}>{option[locale]}</option>)}</select></label>
          <label className="message-label">{t.message}<textarea name="message" required minLength={10} placeholder={locale === "ru" ? "Что вы хотите создать?" : "What are you trying to build?"}/></label>
          {turnstileSiteKey && <div className="turnstile-field-wrap">
            <div className={`turnstile-field ${turnstileStatus === "error" ? "turnstile-field-hidden" : ""}`} ref={turnstileRef}/>
            {turnstileStatus === "error" && <div className="turnstile-fallback"><AlertTriangle/><p>{locale === "ru" ? "Cloudflare-проверка не подключилась. Проверьте VPN/ad blocker или попробуйте еще раз." : "Cloudflare verification could not connect. Check VPN/ad blocker or try again."}</p><button type="button" onClick={() => { setTurnstileToken(""); setTurnstileStatus("loading"); setTurnstileRetryKey(value => value + 1); }}>{locale === "ru" ? "Повторить" : "Retry"}</button></div>}
          </div>}
          <input className="honeypot" name="website" tabIndex={-1} autoComplete="off"/><button className="submit" disabled={formState === "loading" || (!!turnstileSiteKey && !turnstileToken)}>{formState === "loading" ? t.sending : t.send}<ArrowRight/></button>{turnstileSiteKey && turnstileStatus === "loading" && !turnstileToken && <p className="form-state muted">{locale === "ru" ? "Загружаем защиту формы..." : "Loading form protection..."}</p>}{formState === "success" && <p className="form-state success"><Check/>{t.success}</p>}{formState === "error" && <p className="form-state error">{t.error}</p>}
        </form>
      </div>
    </section>
  </main>;
}

function InfoPanel({ title, items, icons, action, onAction, locale }: { title: string; items: readonly (readonly string[])[]; icons?: typeof workIcons; action: string; onAction?: () => void; locale: "ru" | "en" }) {
  return <article className="info-panel"><h2>{title}<i/></h2><div>{items.map((item, index) => { const Icon = icons?.[index] || Sparkles; return <p key={item[0]}><Icon/><span>{localizeAi(item[0], locale)}</span><small>{item[1]}</small></p>; })}</div><button type="button" onClick={onAction}>{action}<ArrowRight/></button></article>;
}
function SectionHead({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) { return <div className="section-head"><div><p>{eyebrow}</p><h2>{title}<i/></h2></div>{action && <button type="button" onClick={onAction}>{action}<ArrowRight/></button>}</div>; }
function ContactItem({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) { return <li><Icon/><div><b>{title}</b><span>{text}</span></div></li>; }

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}
