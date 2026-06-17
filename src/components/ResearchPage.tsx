"use client";

import Image from "next/image";
import Link from "next/link";
import { ByteDance, Claude, Codex, DeepSeek, ElevenLabs, Gemini, HermesAgent, Manus, N8n, OpenClaw, Zapier } from "@lobehub/icons";
import { ArrowRight, AudioLines, Bot, BrainCircuit, Database, Layers3, MonitorUp, Phone, Sparkles, Users } from "lucide-react";
import { useEffect } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import SiteHeader from "@/components/SiteHeader";
import { useSitePreferences } from "@/lib/preferences";
import { localizeAi } from "@/lib/localize";

const researchCopy = {
  ru: {
    title: "Исследования", intro: "Изучаю идеи, технологии и системы, которые будут формировать будущее.",
    areas: "Что я исследую", areasNote: "Технологии и системы, которые, на мой взгляд, определят будущее.", ongoing: "Текущие направления",
    experiments: "Активные эксперименты", experimentsNote: "Концепции и прототипы, которые сейчас проходят проверку.", live: "Живые эксперименты",
    tools: "Инструменты и платформы", toolsNote: "Технологии, которые я использую, изучаю и оцениваю.", core: "Основной стек",
    future: "Потенциал", quote1: "Будущее не открывается предсказанием.", quote2: "Оно открывается через эксперименты.",
    quoteText: "Я исследую технологии, создаю прототипы и тестирую системы, чтобы понять, что дает реальное преимущество.", ctaTitle: "Есть система, которую стоит исследовать?", ctaText: "Обсудим идею, проверим гипотезу и определим следующий практический шаг.", ctaPrimary: "Начать разговор", ctaSecondary: "Смотреть проекты",
  },
  en: {
    title: "Research", intro: "Exploring ideas, technologies and systems that will shape the future.",
    areas: "What I’m Researching", areasNote: "Technologies and systems I believe will shape the future.", ongoing: "Ongoing research areas",
    experiments: "Active Experiments", experimentsNote: "Concepts and prototypes currently being tested.", live: "Live experiments",
    tools: "Tools & Platforms", toolsNote: "Technologies I actively use, study and evaluate.", core: "Core tools",
    future: "Potential Future", quote1: "The future is not discovered through prediction.", quote2: "It is discovered through experimentation.",
    quoteText: "I research technologies, build prototypes and test systems to understand what creates real-world leverage.", ctaTitle: "Have a system worth exploring?", ctaText: "Let’s discuss the idea, test the hypothesis and define the next practical step.", ctaPrimary: "Start a conversation", ctaSecondary: "Explore projects",
  },
} as const;

const areas = [
  [{ ru: "ИИ-агенты", en: "AI Agents" }, "Автономные системы, способные рассуждать, планировать и действовать.", "Autonomous systems capable of reasoning, planning and taking action.", BrainCircuit, { ru: "Исследую", en: "Researching" }],
  [{ ru: "Робототехника", en: "Robotics" }, "Интеллектуальные машины, работающие в физическом мире.", "Intelligent machines operating in physical environments.", Bot, { ru: "Изучаю", en: "Exploring" }],
  [{ ru: "Интерфейсы человек–ИИ", en: "Human-AI Interfaces" }, "Естественные, голосовые и контекстные способы взаимодействия.", "Natural, voice-first and context-aware interactions.", AudioLines, { ru: "Исследую", en: "Researching" }],
  [{ ru: "Инфраструктура будущего", en: "Future Infrastructure" }, "Системы и платформы для ИИ-нативных продуктов.", "Systems, platforms and architectures for AI-native products.", Layers3, { ru: "Наблюдаю", en: "Watching" }],
  [{ ru: "Системы знаний", en: "Knowledge Systems" }, "Как организации хранят, извлекают и используют знания.", "How organizations store, retrieve and leverage intelligence.", Database, { ru: "Проверяю", en: "Investigating" }],
] as const;

const experiments = [
  [{ ru: "ИИ-регистратор", en: "AI Receptionist" }, "Голосовой ИИ отвечает на звонки, квалифицирует лиды и назначает встречи.", "Voice AI that answers calls, qualifies leads and books appointments.", Phone, { ru: "Тестирую", en: "Testing" }, { ru: "Интеллектуальная работа с клиентами 24/7.", en: "24/7 intelligent customer acquisition." }],
  [{ ru: "Корпоративный мозг знаний", en: "Company Knowledge Brain" }, "Внутренний ИИ, обученный на знаниях, регламентах и документации компании.", "Internal AI trained on company knowledge, SOPs and documentation.", BrainCircuit, { ru: "Создаю", en: "Building" }, { ru: "Мгновенная организационная память.", en: "Instant organizational memory." }],
  [{ ru: "Мультиагентные команды", en: "Multi-Agent Teams" }, "Специализированные ИИ-агенты совместно выполняют сложные процессы.", "Specialized AI agents collaborating on complex workflows.", Users, { ru: "Исследую", en: "Researching" }, { ru: "Цифровые рабочие команды.", en: "Digital workforces." }],
  [{ ru: "Центр ИИ-операций", en: "AI Operations Center" }, "Системы, которые наблюдают за операциями и рекомендуют действия.", "Systems that monitor operations and recommend actions.", MonitorUp, { ru: "Изучаю", en: "Exploring" }, { ru: "Бизнес, действующий проактивно.", en: "Businesses that operate proactively." }],
  [{ ru: "Интеграции с робототехникой", en: "Robotics Integrations" }, "Соединение ИИ-софта с физическими машинами и средами.", "Connecting AI software with physical machines and environments.", Bot, { ru: "Проверяю", en: "Investigating" }, { ru: "Автономные операции в реальном мире.", en: "Autonomous real-world operations." }],
] as const;

const primaryTools = [
  ["Claude", Claude.Color, null, { ru: "Продвинутые рассуждения и работа с большим контекстом.", en: "Advanced reasoning and long-context intelligence." }, { ru: "Каждый день", en: "Daily Use" }],
  ["Codex", Codex.Color, null, { ru: "ИИ-разработка программного обеспечения и генерация кода.", en: "AI-powered software engineering and code generation." }, { ru: "Каждый день", en: "Daily Use" }],
  ["n8n", N8n.Color, null, { ru: "Инфраструктура автоматизации и оркестрация процессов.", en: "Automation infrastructure and workflow orchestration." }, { ru: "Каждый день", en: "Daily Use" }],
  ["Supabase", null, "/brands/supabase.svg", { ru: "Современная серверная платформа и база данных.", en: "Modern backend and database platform." }, { ru: "Каждый день", en: "Daily Use" }],
  ["Gemini", Gemini.Color, null, { ru: "Мультимодальные рассуждения и масштабные ИИ-исследования.", en: "Multimodal reasoning and large-scale AI research." }, { ru: "Исследую", en: "Research" }],
  ["ElevenLabs", ElevenLabs, null, { ru: "Синтез голоса и разговорные интерфейсы.", en: "Voice synthesis and conversational interfaces." }, { ru: "Тестирую", en: "Testing" }],
  ["DeepSeek", DeepSeek.Color, null, { ru: "Открытые модели рассуждений и программирования.", en: "Open-source reasoning and coding models." }, { ru: "Оцениваю", en: "Evaluating" }],
] as const;

const secondaryTools = [
  ["Seedance 2", ByteDance.Color, null, { ru: "Генерация и производство видео нового поколения.", en: "Next-generation generative video production." }, { ru: "Тестирую", en: "Testing" }],
  ["Zapier", Zapier.Color, null, { ru: "Автоматизация приложений и бизнес-процессов.", en: "Application and business workflow automation." }, { ru: "Использую", en: "Using" }],
  ["HeyGen", null, "/brands/heygen.ico", { ru: "Видеоаватары, локализация и синтетические медиа.", en: "Video avatars, localization and synthetic media." }, { ru: "Тестирую", en: "Testing" }],
  ["Manus", Manus, null, { ru: "Автономный агент для многоэтапных задач.", en: "Autonomous agent for multi-step tasks." }, { ru: "Исследую", en: "Research" }],
  ["Genspark", null, "/brands/genspark.ico", { ru: "Агентный поиск, исследования и создание материалов.", en: "Agentic search, research and content creation." }, { ru: "Изучаю", en: "Exploring" }],
  ["OpenClaw", OpenClaw.Color, null, { ru: "Открытая агентная инфраструктура и управление инструментами.", en: "Open agent infrastructure and tool control." }, { ru: "Оцениваю", en: "Evaluating" }],
  ["Hermes", HermesAgent, null, { ru: "Агентные рассуждения, инструменты и выполнение задач.", en: "Agent reasoning, tools and task execution." }, { ru: "Исследую", en: "Research" }],
] as const;

export default function ResearchPage() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const t = researchCopy[locale];
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  return <main className="editorial-page research-page">
    <AmbientBackground/>
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="research"/>
    <section className="editorial-hero research-hero shell">
      <div><h1>{t.title}<i/></h1><p>{t.intro}</p></div>
      <div className="research-hero-image"><Image src="/research/research-hero-system.png" alt="" fill priority sizes="(max-width: 800px) 100vw, 55vw"/></div>
    </section>

    <EditorialSection number="01" title={t.areas} note={t.areasNote} meta={t.ongoing}>
      <div className="research-card-grid">{areas.map(([name, ru, en, Icon, state]) => <article className="research-card" key={name.en}><header><span><Icon/></span><b>{state[locale]}</b></header><h3>{name[locale]}</h3><p>{localizeAi(locale === "ru" ? ru : en, locale)}</p><ArrowRight/></article>)}</div>
    </EditorialSection>

    <EditorialSection id="experiments" number="02" title={t.experiments} note={t.experimentsNote} meta={t.live}>
      <div className="research-card-grid experiment-grid">{experiments.map(([name, ru, en, Icon, state, future]) => <article className="research-card experiment-card" key={name.en}><header><span><Icon/></span><b>{state[locale]}</b></header><h3>{name[locale]}</h3><p>{localizeAi(locale === "ru" ? ru : en, locale)}</p><footer><small>{t.future}</small><p>{future[locale]}</p></footer><ArrowRight/></article>)}</div>
    </EditorialSection>

    <EditorialSection number="03" title={t.tools} note={t.toolsNote} meta={t.core}>
      <div className="tool-rows"><ToolGrid tools={primaryTools} locale={locale}/><ToolGrid tools={secondaryTools} locale={locale} secondary/></div>
    </EditorialSection>

    <section className="research-quote shell"><div><Sparkles/><h2>{t.quote1}<strong>{t.quote2}</strong></h2><i/><p>{t.quoteText}</p><Link href="/about">{locale === "ru" ? "О подходе" : "About the approach"}<ArrowRight/></Link></div><Image src="/research/neural-field.png" alt="" fill sizes="50vw"/></section>
    <section className="research-cta shell"><div><span>04</span><h2>{t.ctaTitle}<i/></h2><p>{t.ctaText}</p></div><nav><Link className="projects-primary" href="/#start-conversation">{t.ctaPrimary}<ArrowRight/></Link><Link className="projects-secondary" href="/projects">{t.ctaSecondary}<ArrowRight/></Link></nav></section>
  </main>;
}

function ToolGrid({ tools, locale, secondary = false }: { tools: readonly (readonly [string, React.ComponentType<{ size?: number }> | null, string | null, { readonly ru: string; readonly en: string }, { readonly ru: string; readonly en: string }])[]; locale: "ru" | "en"; secondary?: boolean }) {
  return <div className={`tool-grid ${secondary ? "tool-grid-secondary" : ""}`}>{tools.map(([name, Icon, image, description, state]) => <article key={name}><i>{Icon ? <Icon size={38}/> : image ? <Image src={image} alt={name} width={38} height={38}/> : null}</i><h3>{name}</h3><p>{description[locale]}</p><b>{state[locale]}</b></article>)}</div>;
}

function EditorialSection({ id, number, title, note, meta, children }: { id?: string; number: string; title: string; note: string; meta: string; children: React.ReactNode }) {
  return <section className="editorial-section shell" id={id}><header><span>{number}</span><div><h2>{title}<i/></h2><p>{note}</p></div><small>{meta}<i/></small></header>{children}</section>;
}
