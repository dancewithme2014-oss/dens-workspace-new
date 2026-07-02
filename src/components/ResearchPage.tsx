"use client";

import Image from "next/image";
import { Antigravity, ByteDance, Claude, Cloudflare, Codex, Cursor, DeepSeek, ElevenLabs, Gemini, Groq, HermesAgent, Manus, Mistral, N8n, OpenClaw, Vercel, Zapier } from "@lobehub/icons";
import { ArrowRight, AudioLines, Bot, BrainCircuit, ChevronDown, ChevronUp, Database, GitBranch, Layers3, MonitorUp, Phone, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
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
    showMoreTools: "Смотреть еще", hideTools: "Скрыть",
    future: "Потенциал", quote1: "Будущее не открывается предсказанием.", quote2: "Оно открывается через эксперименты.",
    quoteText: "Я исследую технологии, создаю прототипы и тестирую системы, чтобы понять, что дает реальное преимущество.", ctaTitle: "Есть система, которую стоит исследовать?", ctaText: "Обсудим идею, проверим гипотезу и определим следующий практический шаг.", ctaPrimary: "Начать разговор", ctaSecondary: "Смотреть проекты",
  },
  en: {
    title: "Research", intro: "Exploring ideas, technologies and systems that will shape the future.",
    areas: "What I’m Researching", areasNote: "Technologies and systems I believe will shape the future.", ongoing: "Ongoing research areas",
    experiments: "Active Experiments", experimentsNote: "Concepts and prototypes currently being tested.", live: "Live experiments",
    tools: "Tools & Platforms", toolsNote: "Technologies I actively use, study and evaluate.", core: "Core tools",
    showMoreTools: "Show more", hideTools: "Hide",
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

type ToolCategory = "all" | "text" | "code" | "automation" | "data" | "voice" | "video" | "agents";
type ToolItem = {
  name: string;
  icon: React.ComponentType<{ size?: number }> | null;
  image: string | null;
  description: { readonly ru: string; readonly en: string };
  state: { readonly ru: string; readonly en: string };
  categories: readonly Exclude<ToolCategory, "all">[];
};

const toolCategories: { id: ToolCategory; ru: string; en: string }[] = [
  { id: "all", ru: "Все", en: "All" },
  { id: "text", ru: "Текст", en: "Text" },
  { id: "code", ru: "Код", en: "Code" },
  { id: "automation", ru: "Автоматизация", en: "Automation" },
  { id: "data", ru: "Данные", en: "Data" },
  { id: "voice", ru: "Речь и звук", en: "Voice & Audio" },
  { id: "video", ru: "Видео", en: "Video" },
  { id: "agents", ru: "Агенты", en: "Agents" },
];

const primaryTools: ToolItem[] = [
  { name: "Claude", icon: Claude.Color, image: null, description: { ru: "Продвинутые рассуждения и работа с большим контекстом.", en: "Advanced reasoning and long-context intelligence." }, state: { ru: "Каждый день", en: "Daily Use" }, categories: ["text", "agents"] },
  { name: "Codex", icon: Codex.Color, image: null, description: { ru: "ИИ-разработка программного обеспечения и генерация кода.", en: "AI-powered software engineering and code generation." }, state: { ru: "Каждый день", en: "Daily Use" }, categories: ["code", "agents"] },
  { name: "n8n", icon: N8n.Color, image: null, description: { ru: "Инфраструктура автоматизации и оркестрация процессов.", en: "Automation infrastructure and workflow orchestration." }, state: { ru: "Каждый день", en: "Daily Use" }, categories: ["automation"] },
  { name: "Supabase", icon: null, image: "/brands/supabase.svg", description: { ru: "Современная серверная платформа и база данных.", en: "Modern backend and database platform." }, state: { ru: "Каждый день", en: "Daily Use" }, categories: ["data", "automation"] },
  { name: "Gemini", icon: Gemini.Color, image: null, description: { ru: "Мультимодальные рассуждения и масштабные ИИ-исследования.", en: "Multimodal reasoning and large-scale AI research." }, state: { ru: "Исследую", en: "Research" }, categories: ["text", "video", "agents"] },
  { name: "ElevenLabs", icon: ElevenLabs, image: null, description: { ru: "Синтез голоса и разговорные интерфейсы.", en: "Voice synthesis and conversational interfaces." }, state: { ru: "Тестирую", en: "Testing" }, categories: ["voice"] },
  { name: "DeepSeek", icon: DeepSeek.Color, image: null, description: { ru: "Открытые модели рассуждений и программирования.", en: "Open-source reasoning and coding models." }, state: { ru: "Оцениваю", en: "Evaluating" }, categories: ["text", "code"] },
  { name: "GitHub", icon: GitBranch, image: null, description: { ru: "Репозитории, pull request-процессы и совместная разработка.", en: "Repositories, pull request workflows and collaborative development." }, state: { ru: "Каждый день", en: "Daily Use" }, categories: ["code", "automation"] },
  { name: "Vercel", icon: Vercel, image: null, description: { ru: "Деплой, preview-среды и production-инфраструктура для сайтов.", en: "Deployments, preview environments and production infrastructure for websites." }, state: { ru: "Каждый день", en: "Daily Use" }, categories: ["code", "automation"] },
  { name: "Cloudflare", icon: Cloudflare.Color, image: null, description: { ru: "Защита, DNS, edge-инфраструктура и контроль трафика.", en: "Security, DNS, edge infrastructure and traffic control." }, state: { ru: "Использую", en: "Using" }, categories: ["automation", "data"] },
];

const secondaryTools: ToolItem[] = [
  { name: "Groq", icon: Groq, image: null, description: { ru: "Быстрый inference для LLM-сценариев и прототипов.", en: "Fast inference for LLM workflows and prototypes." }, state: { ru: "Оцениваю", en: "Evaluating" }, categories: ["text", "code"] },
  { name: "Mistral", icon: Mistral.Color, image: null, description: { ru: "Европейские модели для текста, агентов и бизнес-сценариев.", en: "European models for text, agents and business workflows." }, state: { ru: "Исследую", en: "Research" }, categories: ["text", "agents"] },
  { name: "Cursor", icon: Cursor, image: null, description: { ru: "ИИ-среда разработки для быстрого прототипирования и рефакторинга.", en: "AI coding environment for rapid prototyping and refactoring." }, state: { ru: "Использую", en: "Using" }, categories: ["code", "agents"] },
  { name: "Antigravity", icon: Antigravity.Color, image: null, description: { ru: "Агентная среда разработки и эксперименты с автономным кодингом.", en: "Agentic development environment and autonomous coding experiments." }, state: { ru: "Тестирую", en: "Testing" }, categories: ["code", "agents"] },
  { name: "Seedance 2", icon: ByteDance.Color, image: null, description: { ru: "Генерация и производство видео нового поколения.", en: "Next-generation generative video production." }, state: { ru: "Тестирую", en: "Testing" }, categories: ["video"] },
  { name: "Zapier", icon: Zapier.Color, image: null, description: { ru: "Автоматизация приложений и бизнес-процессов.", en: "Application and business workflow automation." }, state: { ru: "Использую", en: "Using" }, categories: ["automation"] },
  { name: "HeyGen", icon: null, image: "/brands/heygen.ico", description: { ru: "Видеоаватары, локализация и синтетические медиа.", en: "Video avatars, localization and synthetic media." }, state: { ru: "Тестирую", en: "Testing" }, categories: ["video", "voice"] },
  { name: "Manus", icon: Manus, image: null, description: { ru: "Автономный агент для многоэтапных задач.", en: "Autonomous agent for multi-step tasks." }, state: { ru: "Исследую", en: "Research" }, categories: ["agents", "automation"] },
  { name: "Genspark", icon: null, image: "/brands/genspark.ico", description: { ru: "Агентный поиск, исследования и создание материалов.", en: "Agentic search, research and content creation." }, state: { ru: "Изучаю", en: "Exploring" }, categories: ["text", "agents"] },
  { name: "OpenClaw", icon: OpenClaw.Color, image: null, description: { ru: "Открытая агентная инфраструктура и управление инструментами.", en: "Open agent infrastructure and tool control." }, state: { ru: "Оцениваю", en: "Evaluating" }, categories: ["agents", "automation"] },
  { name: "Hermes", icon: HermesAgent, image: null, description: { ru: "Агентные рассуждения, инструменты и выполнение задач.", en: "Agent reasoning, tools and task execution." }, state: { ru: "Исследую", en: "Research" }, categories: ["text", "agents"] },
];

const toolExternalLinks: Record<string, string> = {
  Claude: "https://claude.ai/",
  Codex: "https://openai.com/codex/",
  n8n: "https://n8n.io/",
  Supabase: "https://supabase.com/",
  Gemini: "https://gemini.google.com/",
  ElevenLabs: "https://elevenlabs.io/",
  DeepSeek: "https://www.deepseek.com/en/",
  GitHub: "https://github.com/",
  Vercel: "https://vercel.com/",
  Cloudflare: "https://www.cloudflare.com/",
  Groq: "https://groq.com/",
  Mistral: "https://mistral.ai/",
  Cursor: "https://cursor.com/",
  Antigravity: "https://antigravity.google/",
  "Seedance 2": "https://seed.bytedance.com/en/seedance2_0",
  Zapier: "https://zapier.com/",
  HeyGen: "https://www.heygen.com/",
  Manus: "https://manus.im/",
  Genspark: "https://www.genspark.ai/",
  OpenClaw: "https://openclaw.ai/",
  Hermes: "https://hermes-agent.nousresearch.com/",
};

export default function ResearchPage() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const [toolCategory, setToolCategory] = useState<ToolCategory>("all");
  const [showAllTools, setShowAllTools] = useState(false);
  const t = researchCopy[locale];
  const allTools = [...primaryTools, ...secondaryTools];
  const allVisibleTools = showAllTools ? allTools : allTools.slice(0, 14);
  const hasMoreAllTools = allTools.length > 14;
  const filteredPrimaryTools = filterTools(primaryTools, toolCategory);
  const filteredSecondaryTools = filterTools(secondaryTools, toolCategory);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  return <main className="editorial-page research-page">
    <AmbientBackground/>
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="research"/>
    <section className="editorial-hero research-hero shell">
      <div><h1>{t.title}<i/></h1><p>{t.intro}</p></div>
      <div className="research-hero-image"><Image src="/research/research-hero-system.webp" alt="" fill priority sizes="(max-width: 800px) 100vw, 55vw"/></div>
    </section>

    <EditorialSection number="01" title={t.areas} note={t.areasNote} meta={t.ongoing}>
      <div className="research-card-grid">{areas.map(([name, ru, en, Icon, state]) => <article className="research-card" key={name.en}><header><span><Icon/></span><b>{state[locale]}</b></header><h3>{name[locale]}</h3><p>{localizeAi(locale === "ru" ? ru : en, locale)}</p><ArrowRight/></article>)}</div>
    </EditorialSection>

    <EditorialSection id="experiments" number="02" title={t.experiments} note={t.experimentsNote} meta={t.live}>
      <div className="research-card-grid experiment-grid">{experiments.map(([name, ru, en, Icon, state, future]) => <article className="research-card experiment-card" key={name.en}><header><span><Icon/></span><b>{state[locale]}</b></header><h3>{name[locale]}</h3><p>{localizeAi(locale === "ru" ? ru : en, locale)}</p><footer><small>{t.future}</small><p>{future[locale]}</p></footer><ArrowRight/></article>)}</div>
    </EditorialSection>

    <EditorialSection number="03" title={t.tools} note={t.toolsNote} meta={t.core}>
      <div className="tool-filter-bar" aria-label={locale === "ru" ? "Фильтр инструментов" : "Tool filter"}>
        {toolCategories.map(category => <button type="button" key={category.id} className={toolCategory === category.id ? "active" : ""} onClick={() => {
          setToolCategory(category.id);
          setShowAllTools(false);
        }}>{category[locale]}</button>)}
      </div>
      {toolCategory === "all" ? <>
        <div className="tool-rows">
          <ToolGrid tools={allVisibleTools} locale={locale}/>
        </div>
        {hasMoreAllTools && <div className="tool-more-actions">
          <button type="button" onClick={() => setShowAllTools(current => !current)}>
            {showAllTools ? t.hideTools : t.showMoreTools}
            {showAllTools ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
        </div>}
      </> : <div className="tool-rows">
        {filteredPrimaryTools.length > 0 && <ToolGrid tools={filteredPrimaryTools} locale={locale}/>}
        {filteredSecondaryTools.length > 0 && <ToolGrid tools={filteredSecondaryTools} locale={locale} secondary/>}
      </div>}
    </EditorialSection>

    <section className="research-quote shell"><div><Sparkles/><h2>{t.quote1}<strong>{t.quote2}</strong></h2><i/><p>{t.quoteText}</p><Link href="/about">{locale === "ru" ? "О подходе" : "About the approach"}<ArrowRight/></Link></div><Image src="/research/neural-field.png" alt="" fill sizes="50vw"/></section>
    <section className="research-cta shell"><div><span>04</span><h2>{t.ctaTitle}<i/></h2><p>{t.ctaText}</p></div><nav><Link className="projects-primary" href="/#start-conversation">{t.ctaPrimary}<ArrowRight/></Link><Link className="projects-secondary" href="/projects">{t.ctaSecondary}<ArrowRight/></Link></nav></section>
  </main>;
}

function filterTools(tools: ToolItem[], category: ToolCategory) {
  return category === "all" ? tools : tools.filter(tool => tool.categories.includes(category));
}

function ToolGrid({ tools, locale, secondary = false }: { tools: readonly ToolItem[]; locale: "ru" | "en"; secondary?: boolean }) {
  return <div className={`tool-grid ${secondary ? "tool-grid-secondary" : ""}`}>{tools.map(({ name, icon: Icon, image, description, state }) => {
    const href = toolExternalLinks[name];
    return <a key={name} className="tool-card-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}`} title={`Open ${name}`}>
      <article><i>{Icon ? <Icon size={38}/> : image ? <Image src={image} alt={name} width={38} height={38}/> : null}</i><h3>{name}</h3><p>{description[locale]}</p><b>{state[locale]}</b></article>
    </a>;
  })}</div>;
}

function EditorialSection({ id, number, title, note, meta, children }: { id?: string; number: string; title: string; note: string; meta: string; children: React.ReactNode }) {
  return <section className="editorial-section shell" id={id}><header><span>{number}</span><div><h2>{title}<i/></h2><p>{note}</p></div><small>{meta}<i/></small></header>{children}</section>;
}
