"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AudioLines, Bot, Box, Database, Eye, FlaskConical, Handshake, Layers3, Network, Search, Send, Sparkles, TrendingUp, UserRound, Zap } from "lucide-react";
import { useEffect } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import SiteHeader from "@/components/SiteHeader";
import { useSitePreferences } from "@/lib/preferences";
import { localizeAi } from "@/lib/localize";

const aboutCopy = {
  ru: {
    eyebrow: "Обо мне", title: "Создаю бизнес с ИИ", subtitle: "Через системы, автоматизацию и постоянные эксперименты.",
    intro: "Den Workspace — персональная лаборатория, где встречаются бизнес, маркетинг, ИИ и автоматизация. Я исследую новые технологии, создаю реальные системы, проверяю идеи на практике и открыто делюсь тем, что работает.",
    goal: "Цель проста:", bullets: ["Учиться.", "Создавать.", "Экспериментировать.", "Делиться тем, что работает."], what: "Что я делаю", interested: "Что мне интересно", process: "Как я работаю", focus: "Текущий фокус", philosophy: "Философия",
    quote1: "Будущее не открывается предсказанием.", quote2: "Оно открывается через эксперименты.",
    next: "Давайте создадим то, что будет дальше.", nextText: "Если вы создаете продукты, исследуете ИИ, улучшаете маркетинговые системы или проектируете интеллектуальные бизнес-процессы — давайте познакомимся.", start: "Начать разговор", projects: "Смотреть проекты",
  },
  en: {
    eyebrow: "About", title: "Building Businesses With AI", subtitle: "Through Systems, Automation and Continuous Experimentation.",
    intro: "Den Workspace is a personal laboratory where business, marketing, AI and automation come together. I research emerging technologies, build real systems, test ideas in practice and share what actually works.",
    goal: "The goal is simple:", bullets: ["Learn.", "Build.", "Experiment.", "Share what works."], what: "What I Do", interested: "What I’m Interested In", process: "How I Work", focus: "Current Focus", philosophy: "Philosophy",
    quote1: "The future is not discovered through prediction.", quote2: "It is discovered through experimentation.",
    next: "Let’s Build What’s Next.", nextText: "If you’re building products, exploring AI, improving marketing systems or designing intelligent business operations, I’d love to connect.", start: "Start a Conversation", projects: "Explore Projects",
  },
} as const;

const whatIDo = [
  ["Build", "Создаю продукты, процессы, автоматизации и интеллектуальные системы для реальных задач.", "Create products, workflows, automations and intelligent systems that solve real operational problems.", Box],
  ["Explore", "Исследую новые технологии, возможности AI, бизнес-модели и будущие интерфейсы.", "Research emerging technologies, AI capabilities, business models and future interfaces.", Search],
  ["Connect", "Соединяю софт, маркетинг, автоматизацию и AI в системы, создающие преимущество.", "Combine software, marketing, automation and AI into systems that create leverage.", Network],
] as const;

const interests = [
  ["AI Agents", "Автономные системы рассуждения и действий.", "Autonomous systems capable of reasoning and action.", Bot], ["Automation", "Инфраструктура процессов и исполнения.", "Workflow infrastructure and business execution systems.", Zap],
  ["Knowledge Systems", "Как информация становится интеллектом организации.", "How information becomes organizational intelligence.", Database], ["Robotics", "Пересечение софта и физического мира.", "The intersection of software and the physical world.", Bot],
  ["Human-AI Interfaces", "Естественные способы взаимодействия с интеллектуальными системами.", "Natural ways humans interact with intelligent systems.", AudioLines], ["Future Products", "AI-нативные продукты, сервисы и бизнес-модели.", "AI-native products, services and business models.", Box],
] as const;

const process = [["Observe", "Нахожу важные бизнес-проблемы.", "Find interesting business problems and bottlenecks.", Eye], ["Research", "Изучаю технологии и возможности.", "Understand technologies and opportunities.", Search], ["Experiment", "Создаю прототипы и проверяю гипотезы.", "Build prototypes and test assumptions.", FlaskConical], ["Systemize", "Превращаю идеи в повторяемые системы.", "Turn successful ideas into repeatable systems.", Layers3], ["Share", "Документирую продукты и уроки.", "Document findings, products and lessons learned.", Send]] as const;

export default function AboutPage() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const t = aboutCopy[locale];
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  return <main className="editorial-page about-page">
    <AmbientBackground/><SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="about"/>
    <section className="about-hero shell">
      <article><p className="editorial-kicker"><span>01</span>{t.eyebrow}</p><h1>{t.title}<i/></h1><h2>{t.subtitle}</h2><p>{t.intro}</p><b>{t.goal}</b><ul>{t.bullets.map(item => <li key={item}>{item}</li>)}</ul></article>
      <figure className="about-video">
        <video src="/about/workspace.mp4" autoPlay muted playsInline preload="metadata" aria-label={locale === "ru" ? "Денис работает над ИИ-системами" : "Denis working on AI systems"}/>
        <Image className="about-mobile-poster" src="/about/workspace.webp" alt={locale === "ru" ? "Денис работает над ИИ-системами" : "Denis working on AI systems"} fill sizes="100vw" loading="eager"/>
        <div className="about-video-badges">
          <div><UserRound/><p><strong>{locale === "ru" ? "ДЕНИС" : "DENIS"}</strong><span>{locale === "ru" ? "Создатель · ИИ-системы · Автоматизация" : "Builder · AI Systems · Automation"}</span></p></div>
          <div><TrendingUp/><p><strong>{locale === "ru" ? "Сейчас исследую" : "Currently Exploring"}</strong><span>{locale === "ru" ? "ИИ · Бизнес · Маркетинговые системы" : "AI · Business · Marketing Systems"}</span></p></div>
          <div><Handshake/><p><strong>{locale === "ru" ? "Открыт к сотрудничеству" : "Open to Collaboration"}</strong><span>{locale === "ru" ? "Продукты · Системы · Эксперименты" : "Products · Systems · Experiments"}</span></p></div>
        </div>
        <span className="about-watermark-mask" aria-hidden="true"/>
      </figure>
    </section>

    <AboutSection number="02" title={t.what}><div className="about-action-grid">{whatIDo.map(([name, ru, en, Icon], index) => <article key={name}><Icon/><div><h3>{locale === "ru" ? ["Создаю", "Исследую", "Соединяю"][index] : name}</h3><p>{localizeAi(locale === "ru" ? ru : en, locale)}</p></div><ArrowRight/></article>)}</div></AboutSection>
    <AboutSection number="03" title={t.interested}><div className="interest-grid">{interests.map(([name, ru, en, Icon], index) => <article key={name}><Icon/><h3>{locale === "ru" ? ["ИИ-агенты", "Автоматизация", "Системы знаний", "Робототехника", "Интерфейсы человек–ИИ", "Продукты будущего"][index] : name}</h3><p>{localizeAi(locale === "ru" ? ru : en, locale)}</p></article>)}</div></AboutSection>
    <section className="about-process shell"><div><p className="editorial-kicker"><span>04</span>{t.process}</p><div className="process-row">{process.map(([name, ru, en, Icon], index) => <article key={name}><div><Icon/></div><h3>{locale === "ru" ? ["Наблюдаю", "Исследую", "Экспериментирую", "Систематизирую", "Делюсь"][index] : name}</h3><p>{locale === "ru" ? ru : en}</p>{index < process.length - 1 && <ArrowRight/>}</article>)}</div></div><aside><p className="editorial-kicker"><span>05</span>{t.focus}</p>{["AI Products", "Business Systems", "Workflow Automation", "Knowledge Management", "AI-Assisted Operations", "Future Interfaces"].map((item, index) => <p key={item}><i/>{locale === "ru" ? ["ИИ-продукты", "Бизнес-системы", "Автоматизация процессов", "Управление знаниями", "Операции с поддержкой ИИ", "Будущие интерфейсы"][index] : item}<b className={`focus-${index}`}>{locale === "ru" ? ["Создание", "Активно", "Активно", "Исследование", "Тестирование", "Изучение"][index] : ["Building", "Active", "Active", "Researching", "Testing", "Exploring"][index]}</b></p>)}</aside></section>
    <section className="about-philosophy shell"><p className="editorial-kicker"><span>06</span>{t.philosophy}</p><div><Sparkles/><h2>{t.quote1}<strong>{t.quote2}</strong></h2></div><Image src="/research/neural-field.png" alt="" fill sizes="45vw"/></section>
    <div className="about-section-divider shell" aria-hidden="true"/>
    <section className="about-final shell"><p className="editorial-kicker"><span>07</span>{locale === "ru" ? "Что дальше" : "Let’s build what’s next"}</p><div><h2>{t.next}</h2><p>{t.nextText}</p></div><nav><Link className="projects-primary" href="/#start-conversation">{t.start}<ArrowRight/></Link><Link className="projects-secondary" href="/projects">{t.projects}<ArrowRight/></Link></nav></section>
  </main>;
}

function AboutSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <section className="about-section shell"><p className="editorial-kicker"><span>{number}</span>{title}</p>{children}</section>; }
