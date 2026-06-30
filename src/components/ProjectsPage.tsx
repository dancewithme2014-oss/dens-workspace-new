"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Atom, Bot, BrainCircuit, Clock3, ExternalLink, GitBranch, Layers3, Mail, MapPin, Mic2, MonitorSmartphone, Network, Orbit, Play, Radar, Workflow } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SystemArchitecture from "@/components/SystemArchitecture";
import LoopingVideo from "@/components/LoopingVideo";
import type { PortfolioProject } from "@/lib/projects-data";
import { localizeAi } from "@/lib/localize";
import { useSitePreferences } from "@/lib/preferences";

const copy = {
  ru: {
    eyebrow: "ИИ Системы и Продукты",
    title: ["Продукты.", "Системы.", "Эксперименты."],
    intro: "Растущая коллекция ИИ-продуктов, бизнес-систем и экспериментов, созданных для совместной работы людей и интеллектуальных систем.",
    explore: "Смотреть проекты",
    map: "Карта систем",
    featured: "Избранные системы",
    all: "Все проекты",
    showcase: "Проекты в деталях",
    problem: "Проблема",
    solution: "Решение",
    features: "Ключевые возможности",
    stack: "Технологии",
    focus: "Сейчас в фокусе",
    solves: "Что решает",
    founder: "Заметка основателя",
    mobile: "Мобильный опыт",
    mobileText: "Создано для поиска, записи, live-commerce и повторного вовлечения.",
    mobileBullets: ["Быстрый поиск бизнеса", "Коммерция через прямые эфиры", "Прямая запись и покупка"],
    contactQuestion: "Есть проект, который стоит реализовать?",
    contactPrompt: "Отправьте мне идею, узкое место или систему, которую хотите создать.",
    response: "Моментально",
    connections: "Связи системы",
    research: "Исследования и эксперименты",
    researchNote: "Направления, которые мы изучаем сейчас.",
    contact: "Давайте создадим",
    contactAccent: "то, что будет дальше.",
    contactText: "Если вы создаете что-то амбициозное, расскажите мне об этом.",
    name: "Ваше имя",
    email: "Email",
    message: "Сообщение",
    send: "Начать разговор",
    success: "Сообщение отправлено.",
    showMore: "Смотреть еще",
    showLess: "Скрыть",
    emailAction: "Написать на email",
    homeContact: "Открыть форму на главной",
    openProject: "Открыть проект",
  },
  en: {
    eyebrow: "AI Systems and Products",
    title: ["Products.", "Systems.", "Experiments."],
    intro: "A growing collection of AI products, business systems and experiments designed to explore how humans and intelligent systems can work together.",
    explore: "Explore Projects",
    map: "View System Map",
    featured: "Featured Systems",
    all: "View all projects",
    showcase: "Project Showcase",
    problem: "Problem",
    solution: "Solution",
    features: "Key Features",
    stack: "Tech Stack",
    focus: "Current Focus",
    solves: "What It Solves",
    founder: "Founder Note",
    mobile: "Mobile Experience",
    mobileText: "Designed for discovery, booking, live commerce and repeat engagement.",
    mobileBullets: ["Fast business discovery", "Stream-first commerce", "Direct booking and purchase actions"],
    contactQuestion: "Have a project worth building?",
    contactPrompt: "Send me the idea, bottleneck or system you want to create.",
    response: "Instantly",
    connections: "System Connections",
    research: "Research & Exploration",
    researchNote: "Areas currently being explored.",
    contact: "Let’s Build",
    contactAccent: "What’s Next.",
    contactText: "If you’re building something ambitious, I’d love to hear about it.",
    name: "Your Name",
    email: "Email",
    message: "Message",
    send: "Start a Conversation",
    success: "Message sent.",
    showMore: "Show more",
    showLess: "Show less",
    emailAction: "Send an email",
    homeContact: "Open the main contact form",
    openProject: "Open project",
  },
} as const;

const showcaseCopy = {
  ru: {
    biztok: {
      features: ["Live-трансляции", "Чат и вовлечение", "ИИ-рекомендации", "Платежи и аналитика"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "Realtime", "OpenAI", "Payments"],
      solves: "Большинство прямых эфиров привлекают внимание, но не превращают его в продажи. BizTok сокращает путь между просмотром, доверием и покупкой.",
      founder: "Обычные каталоги помогают людям находить бизнес. Социальные сети помогают бизнесу привлекать внимание. BizTok соединяет оба мира в один коммерческий сценарий.",
    },
    "osa-consulting": {
      features: ["Позиционирование услуг", "Квалификация заявок", "Контентные страницы", "Маршрутизация лидов"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "OpenAI", "n8n", "Analytics"],
      solves: "Консалтинговые услуги часто выглядят абстрактно, а заявки приходят без контекста. OSA Consulting превращает экспертность в понятный путь: от интереса до квалифицированного обращения.",
      founder: "Для консалтинга сайт должен быть не витриной, а системой доверия. Он объясняет подход, собирает правильные данные и помогает быстрее понять, с кем и как работать.",
    },
    "virtual-coo": {
      features: ["Панель руководителя", "Приоритеты и задачи", "ИИ-рекомендации", "Операционные сигналы"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "OpenAI", "n8n", "BI Layer"],
      solves: "В бизнесе много задач, встреч и метрик, но мало единого операционного ритма. Virtual COO собирает приоритеты, данные и действия в одно рабочее пространство.",
      founder: "Операционная система не должна просто показывать данные. Она должна помогать руководителю каждый день видеть главное, принимать решения и запускать следующие действия.",
    },
    "warehouse-app": {
      features: ["Учет запасов", "Визуальный контроль", "Оповещения", "Прогнозирование дефицита"],
      stack: ["Next.js", "Computer Vision", "Supabase", "PostgreSQL", "Realtime Events", "WMS/ERP"],
      solves: "Склад теряет деньги, когда данные об остатках расходятся с реальностью. Warehouse App связывает визуальный контроль, события и аналитику запасов в одну систему.",
      founder: "Складская автоматизация ценна только тогда, когда она помогает команде действовать быстрее. Поэтому фокус здесь не на красивых графиках, а на точных сигналах и понятных действиях.",
    },
    "n8n-news": {
      features: ["Мониторинг источников", "Редакционные черновики", "Публикация новостей", "Telegram-сценарии"],
      stack: ["n8n", "Supabase", "Next.js", "OpenAI", "Vercel Blob", "Telegram API"],
      solves: "Ручной мониторинг новостей забирает время и быстро становится хаотичным. N8N News Autoposting собирает источники, готовит материалы и проводит публикацию через управляемый редакционный поток.",
      founder: "Хорошая автоматизация контента не должна публиковать все подряд. Она должна собирать сигнал, оставлять место редактору и сохранять контроль над качеством.",
    },
    "mmz1-promo": {
      features: ["Кинематографичный лендинг", "Видео-презентация", "Сценарий вовлечения", "Контактный CTA"],
      stack: ["Next.js", "Motion UI", "Video Assets", "Vercel", "Responsive UI", "Analytics"],
      solves: "Промо-страницы часто показывают продукт, но не создают ощущения бренда. MMZ1 Promo строит эмоциональную подачу через медиа, движение и четкий путь к контакту.",
      founder: "Для промо-проекта важна не только информация, но и темп. Пользователь должен быстро почувствовать атмосферу, понять предложение и получить следующий шаг.",
    },
    "golden-house-dubai": {
      features: ["Премиальная витрина", "Каталог объектов", "Заявки покупателей", "Контент о локации"],
      stack: ["Next.js", "Supabase", "Property CMS", "Lead Forms", "Vercel", "Analytics"],
      solves: "Покупка недвижимости в Дубае требует доверия, статуса и ясной навигации. Golden House Dubai превращает премиальную подачу объектов в понятный путь к заявке.",
      founder: "В недвижимости дизайн должен работать на доверие. Красивые экраны важны, но еще важнее быстро довести человека до объекта, вопроса и контакта.",
    },
    chronos: {
      features: ["Каталог часов", "Премиальная подача", "Карточки коллекций", "Переход к покупке"],
      stack: ["Next.js", "Vercel", "Product Catalog", "Motion UI", "Responsive UI", "Analytics"],
      solves: "В премиальных товарах пользователь покупает не только характеристики, но и ощущение ценности. Chronos выстраивает витрину часов вокруг визуального доверия и удобного выбора.",
      founder: "Luxury-интерфейс должен быть спокойным, точным и уверенным. В Chronos фокус на том, чтобы товар выглядел дорого, а путь пользователя оставался простым.",
    },
    lightbi: {
      features: ["Дашборды реального времени", "Визуальное исследование данных", "Командная аналитика", "Гибкая интеграция источников"],
      stack: ["Next.js", "D3.js", "Supabase", "PostgreSQL", "WebSockets", "Analytics Engine"],
      solves: "Команды тонут в сырых данных, а BI-системы либо перегружены, либо слишком медленные. LightBI даёт лёгкий, быстрый слой аналитики между данными и решением.",
      founder: "BI не должна быть отдельным проектом с выделенной командой. Она должна работать как прозрачный слой — подключаться к любым данным и отвечать на вопросы без шума.",
    },
    website: {
      features: ["Портфолио проектов", "Система бренда", "Демонстрация продуктов", "Клиентские сценарии"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "OpenAI", "n8n", "Vercel"],
      solves: "Фрилансеры и студии показывают работы, но редко выстраивают вокруг них системный бренд. Website превращает портфолио в цельную презентацию — от проекта до контакта.",
      founder: "Сайт — это не просто витрина работ. Это первое впечатление и доказательство компетенции. Каждая секция должна работать на доверие и понятный следующий шаг.",
    },
    "n8n-voice-assistant": {
      features: ["Прием звонков 24/7", "Запись в Google Calendar", "Интеграция с Bitrix24", "Аналитика звонков"],
      stack: ["n8n", "ElevenLabs Voice AI", "Groq LLM", "Redis", "Google Calendar", "Bitrix24 CRM"],
      solves: "Медицинские и сервисные компании теряют клиентов из-за пропущенных звонков и перегрузки операторов. AI Voice Assistant автоматизирует первую линию поддержки, ведет естественный диалог и записывает клиентов 24/7.",
      founder: "Голосовой ИИ не просто отвечает на вопросы. Он полностью берет на себя рутину: проверяет календарь, вносит записи и обновляет CRM, освобождая команду для сложных задач.",
    },
  },
  en: {
    biztok: {
      features: ["Live shopping streams", "Chat and engagement", "AI recommendations", "Payments and analytics"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "Realtime", "OpenAI", "Payments"],
      solves: "Most livestreams generate attention but fail to turn it into transactions. BizTok reduces the distance between watching, trust and buying.",
      founder: "Traditional directories help people find businesses. Social media helps businesses earn attention. BizTok connects both worlds into one commercial flow.",
    },
    "osa-consulting": {
      features: ["Service positioning", "Lead qualification", "Content pages", "Lead routing"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "OpenAI", "n8n", "Analytics"],
      solves: "Consulting services often feel abstract, and inquiries arrive without context. OSA Consulting turns expertise into a clear path from interest to qualified conversation.",
      founder: "A consulting website should be more than a brochure. It should build trust, capture the right context and make it easier to decide who to work with.",
    },
    "virtual-coo": {
      features: ["Executive dashboard", "Priorities and tasks", "AI recommendations", "Operational signals"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "OpenAI", "n8n", "BI Layer"],
      solves: "Businesses have many tasks, meetings and metrics, but rarely one operating rhythm. Virtual COO brings priorities, data and action into one workspace.",
      founder: "An operating system should not just display data. It should help leaders see what matters, make decisions and trigger the next action.",
    },
    "warehouse-app": {
      features: ["Inventory tracking", "Visual control", "Operational alerts", "Shortage forecasting"],
      stack: ["Next.js", "Computer Vision", "Supabase", "PostgreSQL", "Realtime Events", "WMS/ERP"],
      solves: "Warehouses lose money when stock data drifts away from reality. Warehouse App connects visual control, events and inventory intelligence into one system.",
      founder: "Warehouse automation is valuable only when it helps teams act faster. The focus is not pretty charts, but accurate signals and clear next steps.",
    },
    "n8n-news": {
      features: ["Source monitoring", "Editorial drafts", "News publishing", "Telegram workflows"],
      stack: ["n8n", "Supabase", "Next.js", "OpenAI", "Vercel Blob", "Telegram API"],
      solves: "Manual news monitoring consumes time and quickly becomes chaotic. N8N News Autoposting collects sources, prepares materials and runs publishing through a controlled editorial flow.",
      founder: "Good content automation should not publish everything blindly. It should collect signal, keep an editor in control and preserve quality.",
    },
    "mmz1-promo": {
      features: ["Cinematic landing page", "Video presentation", "Engagement flow", "Contact CTA"],
      stack: ["Next.js", "Motion UI", "Video Assets", "Vercel", "Responsive UI", "Analytics"],
      solves: "Promo pages often show a product without creating a brand feeling. MMZ1 Promo builds emotional momentum through media, motion and a clear path to contact.",
      founder: "For a promo project, information is only half the work. The user needs to feel the atmosphere, understand the offer and see the next step.",
    },
    "golden-house-dubai": {
      features: ["Premium showcase", "Property catalog", "Buyer inquiries", "Location content"],
      stack: ["Next.js", "Supabase", "Property CMS", "Lead Forms", "Vercel", "Analytics"],
      solves: "Dubai real-estate discovery requires trust, status and clear navigation. Golden House Dubai turns premium property presentation into a direct path to inquiry.",
      founder: "In real estate, design has to create trust. Beautiful screens matter, but the real job is helping a buyer move from interest to property, question and contact.",
    },
    chronos: {
      features: ["Watch catalog", "Premium presentation", "Collection cards", "Purchase intent"],
      stack: ["Next.js", "Vercel", "Product Catalog", "Motion UI", "Responsive UI", "Analytics"],
      solves: "In premium goods, people buy more than specifications; they buy a sense of value. Chronos builds a watch storefront around visual trust and simple discovery.",
      founder: "A luxury interface should feel calm, precise and confident. Chronos focuses on making the product feel premium while keeping the user journey simple.",
    },
    lightbi: {
      features: ["Real-time dashboards", "Visual data exploration", "Team analytics", "Flexible source integration"],
      stack: ["Next.js", "D3.js", "Supabase", "PostgreSQL", "WebSockets", "Analytics Engine"],
      solves: "Teams drown in raw data while BI tools are either overloaded or too slow. LightBI provides a lightweight, fast analytics layer between data and decisions.",
      founder: "BI should not require a dedicated team. It should work as a transparent layer — connect to any data source and answer questions without friction.",
    },
    website: {
      features: ["Project portfolio", "Brand system", "Product demonstration", "Client engagement flows"],
      stack: ["Next.js", "Supabase", "PostgreSQL", "OpenAI", "n8n", "Vercel"],
      solves: "Freelancers and studios showcase work but rarely build a systematic brand around it. Website turns a portfolio into a coherent presentation — from project to contact.",
      founder: "A website is more than a gallery of work. It is the first impression and proof of competence. Every section should build trust and offer a clear next step.",
    },
    "n8n-voice-assistant": {
      features: ["24/7 Call Handling", "Google Calendar Booking", "Bitrix24 Integration", "Call Analytics"],
      stack: ["n8n", "ElevenLabs Voice AI", "Groq LLM", "Redis", "Google Calendar", "Bitrix24 CRM"],
      solves: "Service businesses lose clients due to missed calls and busy receptionists. AI Voice Assistant automates first-line support, speaks like a human, and manages bookings 24/7.",
      founder: "A voice assistant shouldn't just talk. It must perform real work: checking availability, scheduling bookings, and updating CRM records without human intervention.",
    },
  },
} as const;

type ShowcaseDetail = {
  readonly features: readonly string[];
  readonly stack: readonly string[];
  readonly solves: string;
  readonly founder: string;
};

const research = [
  ["AI Agents", Bot, "Exploring"], ["Voice AI", Mic2, "Testing"], ["Computer Vision", Radar, "Exploring"], ["Knowledge Systems", BrainCircuit, "Researching"],
  ["Human-AI Interfaces", Network, "Testing"], ["Robotics", Orbit, "Exploring"], ["Autonomous Workflows", Workflow, "Researching"], ["Decision Systems", Atom, "Exploring"],
] as const;

export default function ProjectsPage({ projects, mobileMedia, initialProjectId }: { projects: PortfolioProject[]; mobileMedia: Record<string, string[]>; initialProjectId?: string }) {
  const featuredProjects = projects.slice(0, 5);
  const additionalProjects = projects.slice(5);
  const allProjects = projects;
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const initialIndex = Math.max(0, allProjects.findIndex(item => item.architectureId === initialProjectId));
  const [selected, setSelected] = useState(initialIndex);
  const [activeImage, setActiveImage] = useState(0);
  const [showDesktopHeroMedia, setShowDesktopHeroMedia] = useState(false);
  const [showMore, setShowMore] = useState(initialIndex >= featuredProjects.length);
  const additionalProjectsRef = useRef<HTMLDivElement>(null);
  const t = copy[locale];
  const project = allProjects[selected];
  const images = project.gallery;
  const mobileScreens = mobileMedia[project.name] ?? [];
  const hasMobileExperience = mobileScreens.length === 6;
  const detailMap = showcaseCopy[locale] as Record<string, ShowcaseDetail>;
  const detail = detailMap[project.architectureId] ?? detailMap.biztok;

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const update = () => setShowDesktopHeroMedia(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const toggleMoreProjects = () => {
    if (showMore) {
      setShowMore(false);
      return;
    }

    setShowMore(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => additionalProjectsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }));
    });
  };

  return <main className="projects-page projects-redesign">
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="projects"/>

    <section className="pr-hero shell">
      <div className="pr-hero-art" aria-hidden="true">
        {showDesktopHeroMedia ? <><LoopingVideo key={theme} src={theme === "dark" ? "/projects/projects-hero-dark.mp4" : "/projects/projects-hero-light.mp4"}/><span className="video-corner-mask" /></> : <>
          <Image className="theme-art theme-art-dark" src="/projects/projects-hero-dark.webp" alt="" fill sizes="100vw" loading="eager"/>
          <Image className="theme-art theme-art-light" src="/projects/projects-hero-light.webp" alt="" fill sizes="100vw" loading="eager"/>
        </>}
      </div>
      <div className="pr-hero-copy">
        <p className="projects-eyebrow"><i/>{t.eyebrow}</p>
        <h1>{t.title[0]}<br/>{t.title[1]}<br/><strong>{t.title[2]}</strong></h1>
        <p>{t.intro}</p>
        <div><button className="projects-primary" onClick={() => jump("featured")}>{t.explore}<ArrowRight/></button><button className="projects-secondary" onClick={() => jump("connections")}>{t.map}<Layers3/></button></div>
      </div>
    </section>

    <section className="pr-section shell" id="featured">
      <ProjectsHeading title={t.featured}/>
      <div className="pr-featured-grid">{featuredProjects.map((item, index) => <button key={item.name} className={`pr-featured-card ${selected === index ? "selected" : ""}`} onClick={() => { setSelected(index); setActiveImage(0); jump("showcase"); }}>
        <div className="pr-card-top"><span>{item.number}</span><b className={`status ${item.status.toLowerCase()}`}>{localizeProjectStatus(item.status, locale)}</b></div>
        <div className="pr-card-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 78vw, 20vw"/></div>
        <h3>{item.name}</h3><p>{localizeProjectText(item.subtitle, locale)}</p><div className="pr-tags">{item.tags.map(tag => <span key={tag}>{localizeProjectText(tag, locale)}</span>)}</div>
      </button>)}</div>
      {showMore && additionalProjects.length > 0 && <div ref={additionalProjectsRef} className="pr-featured-grid pr-featured-more">{additionalProjects.map((item, index) => <button className={`pr-featured-card ${selected === featuredProjects.length + index ? "selected" : ""}`} key={item.name} onClick={() => { setSelected(featuredProjects.length + index); setActiveImage(0); jump("showcase"); }}>
        <div className="pr-card-top"><span>{item.number}</span><b className={`status ${item.status.toLowerCase()}`}>{localizeProjectStatus(item.status, locale)}</b></div>
        <div className="pr-card-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 78vw, 20vw"/></div>
        <h3>{item.name}</h3><p>{localizeProjectText(item.subtitle, locale)}</p><div className="pr-tags">{item.tags.map(tag => <span key={tag}>{localizeProjectText(tag, locale)}</span>)}</div>
      </button>)}</div>}
      {additionalProjects.length > 0 && <div className="pr-show-more"><button type="button" onClick={toggleMoreProjects} aria-expanded={showMore}>{showMore ? t.showLess : t.showMore}<ArrowRight/></button></div>}
    </section>

    <section className="pr-section shell" id="showcase">
      <ProjectsHeading title={t.showcase}/>
      <div className="pr-case-study">
        <article className="pr-case-copy">
          <h2>{project.name}</h2><p className="pr-case-subtitle">{localizeProjectText(project.subtitle, locale)}</p>
          <p className="pr-case-description">{localizeProjectText(project.description, locale)}</p>
          {project.websiteUrl && <a className="pr-project-link" href={project.websiteUrl} target="_blank" rel="noreferrer">{t.openProject}<ExternalLink/></a>}
          <div className="pr-case-rule"/>
          <h3>{t.solves}</h3><p>{detail.solves}</p>
          <div className="pr-case-columns"><div><h3>{t.features}</h3><ul>{detail.features.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>{t.stack}</h3><ul className="pr-stack-list">{detail.stack.map(item => <li key={item}>{item}</li>)}</ul></div></div>
          <blockquote><b>{t.founder}</b><p>{detail.founder}</p></blockquote>
        </article>
        <div className="pr-case-media">
          <div className="pr-media-stage"><ProjectMedia key={images[activeImage]} src={images[activeImage]} alt={`${project.name} interface`} poster={project.image}/><span className="pr-media-count">{activeImage + 1} / {images.length}</span><button className="previous pr-media-arrow" aria-label="Previous screenshot" onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}><ArrowLeft/></button><button className="next pr-media-arrow" aria-label="Next screenshot" onClick={() => setActiveImage((activeImage + 1) % images.length)}><ArrowRight/></button></div>
          <div className="pr-desktop-thumbs">{images.map((image, index) => <button className={activeImage === index ? "active" : ""} key={image} onClick={() => setActiveImage(index)} aria-label={`Show media ${index + 1}`}>{isVideo(image) ? <><video src={image} muted playsInline preload="metadata"/><i className="pr-thumb-play"><Play/></i></> : <Image src={image} alt="" fill sizes="14vw"/>}</button>)}</div>
        </div>
        {hasMobileExperience && <div className="pr-mobile-experience"><div className="pr-mobile-copy"><div className="pr-mobile-title"><MonitorSmartphone/><span>{t.mobile}</span></div><p>{t.mobileText}</p><ul>{t.mobileBullets.map(item => <li key={item}>{item}</li>)}</ul></div><div className="pr-mobile-screens">{mobileScreens.map((image, index) => <figure key={image}><div><Image src={image} alt={`${project.name} mobile screen ${index + 1}`} fill sizes="(max-width: 700px) 42vw, 10vw"/></div></figure>)}</div></div>}
      </div>
    </section>

    <section className="pr-section shell" id="connections">
      <ProjectsHeading title={t.connections}/>
      <SystemArchitecture key={project.architectureId} locale={locale} projectId={project.architectureId}/>
    </section>

    <section className="pr-section shell" id="research">
      <ProjectsHeading title={t.research}/><p className="pr-section-note">{t.researchNote}</p>
      <div className="pr-research-grid">{research.map(([name, Icon, state], index) => <article key={name}><div><Icon/></div><h3>{localizeResearchName(name, locale)}</h3><b className={`research-state state-${index % 4}`}>{localizeResearchState(state, locale)}</b></article>)}</div>
      <div className="pr-pagination"><i/><i/><i/></div>
    </section>

    <section className="pr-contact shell" id="contact">
      <div className="pr-contact-copy"><p className="pr-contact-kicker">{t.contactQuestion}</p><h2>{t.contact}<strong>{t.contactAccent}</strong></h2><p>{t.contactPrompt}</p><div className="pr-contact-meta"><a href="mailto:hello@densworkspace.com"><Mail/>hello@densworkspace.com</a><span><MapPin/>{locale === "ru" ? "Весь мир · Удаленно" : "Global · Remote"}</span><span><Clock3/>{t.response}</span><a href="https://github.com/dancewithme2014-oss" target="_blank" rel="noreferrer"><GitBranch/>GitHub</a></div></div>
      <div className="pr-contact-actions"><a className="projects-primary" href="mailto:hello@densworkspace.com">{t.emailAction}<Mail/></a><Link className="projects-secondary" href="/#start-conversation">{t.homeContact}<ArrowRight/></Link></div>
    </section>
  </main>;
}

function ProjectsHeading({ title }: { title: string }) {
  return <div className="pr-heading"><h2>{title}<i/></h2></div>;
}

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

function localizeResearchName(name: string, locale: "ru" | "en") {
  if (locale === "en") return name;
  return ({ "AI Agents": "ИИ-агенты", "Voice AI": "Голосовой ИИ", "Computer Vision": "Компьютерное зрение", "Knowledge Systems": "Системы знаний", "Human-AI Interfaces": "Интерфейсы человек–ИИ", Robotics: "Робототехника", "Autonomous Workflows": "Автономные процессы", "Decision Systems": "Системы принятия решений" } as Record<string, string>)[name] ?? localizeAi(name, locale);
}

function localizeResearchState(state: string, locale: "ru" | "en") {
  if (locale === "en") return state;
  return ({ Exploring: "Изучаю", Testing: "Тестирую", Researching: "Исследую" } as Record<string, string>)[state] ?? state;
}

function localizeProjectStatus(status: string, locale: "ru" | "en") {
  if (locale === "en") return status;
  return ({ Active: "Активен", Building: "В разработке", Research: "Исследование", Testing: "Тестирование" } as Record<string, string>)[status] ?? status;
}

function localizeProjectText(text: string, locale: "ru" | "en") {
  if (locale === "en") return text;
  const translations: Record<string, string> = {
    "Live Commerce Platform": "Платформа live-commerce", "AI Consulting Platform": "Платформа ИИ-консалтинга", "AI Operating System": "Операционная ИИ-система", "Inventory Intelligence": "Интеллектуальное управление складом", "Content Automation": "Автоматизация контента", "Interactive Brand Promo": "Интерактивный бренд-промо", "Premium Property Experience": "Премиальный сервис недвижимости",     "Luxury Watch Experience": "Премиальный опыт выбора часов", "Business Intelligence": "Бизнес-аналитика", "Portfolio & Brand System": "Портфолио и бренд",
    "Live-commerce platform for streams, business discovery and purchase intent.": "Платформа live-commerce для эфиров, поиска бизнеса и перехода к покупке.", "AI consulting site that packages offers, qualifies leads and routes requests.": "Сайт ИИ-консалтинга, который упаковывает услуги, квалифицирует лиды и направляет заявки.", "AI operating workspace for priorities, metrics, tasks and execution.": "Операционное ИИ-пространство для приоритетов, метрик, задач и выполнения.", "Inventory intelligence system for stock visibility, visual control and alerts.": "Система складской аналитики для видимости остатков, визуального контроля и оповещений.", "Editorial automation pipeline for source monitoring, drafts and publishing.": "Редакционный конвейер для мониторинга источников, черновиков и публикации.", "Motion-led promotional website for brand storytelling and conversion.": "Промо-сайт с акцентом на движение, историю бренда и конверсию.", "Premium Dubai real estate showcase for property discovery and qualified inquiries.": "Премиальная витрина недвижимости в Дубае для поиска объектов и квалифицированных заявок.",     "Luxury watch storefront for catalog browsing, product storytelling and purchase intent.": "Премиальная витрина часов для каталога, продуктовой подачи и намерения к покупке.",
    "Lightweight BI platform for real-time data exploration, dashboards and team analytics.": "Лёгкая BI-платформа для исследования данных в реальном времени, дашбордов и командной аналитики.",
    "Personal portfolio and brand platform for project showcase, client engagement and system demonstration.": "Персональное портфолио и бренд-платформа для демонстрации проектов, взаимодействия с клиентами и презентации систем.",
    Commerce: "Коммерция", Platform: "Платформа", Consulting: "Консалтинг", Web: "Веб", Operations: "Операции", Logistics: "Логистика", Vision: "Зрение", Content: "Контент", Automation: "Автоматизация", Promo: "Промо", Motion: "Анимация", Property: "Недвижимость", Luxury: "Люкс", Dubai: "Дубай", BI: "BI", Analytics: "Аналитика", Data: "Данные", Portfolio: "Портфолио", Brand: "Бренд",
  };
  return translations[text] ?? localizeAi(text, locale);
}

function ProjectMedia({ src, alt, poster }: { src: string; alt: string; poster: string }) {
  const [playing, setPlaying] = useState(false);
  if (!isVideo(src)) return <div className="pr-desktop-view"><Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 68vw"/></div>;

  return <div className="pr-desktop-view pr-video-view">
    <video id={`project-video-${src.replace(/[^a-z0-9]/gi, "-")}`} src={src} poster={poster} playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}/>
    {!playing && <button className="pr-video-play" type="button" aria-label="Play project video" onClick={(event) => event.currentTarget.previousElementSibling instanceof HTMLVideoElement && event.currentTarget.previousElementSibling.play()}><Play/></button>}
  </div>;
}
