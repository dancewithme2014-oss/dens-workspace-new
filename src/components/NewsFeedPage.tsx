"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  CircleDot,
  Clock3,
  Cpu,
  LayoutDashboard,
  Network,
  RefreshCw,
  SearchCheck,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import SiteHeader from "@/components/SiteHeader";
import { useSitePreferences } from "@/lib/preferences";
import { localizeAi } from "@/lib/localize";
import type { EditorialArticle } from "@/lib/editorial/types";

type FeedCategory = "all" | "ai" | "agents" | "robotics" | "automation" | "research" | "startups";

const feedItems = [
  { id: 1, category: "agents", image: "/ai-universe/chatgpt-v13.png", source: "AI Lab", title: { ru: "Агентные процессы переходят в реальные продукты", en: "Agent workflows move into production" }, description: { ru: "Команды связывают модели, инструменты и контроль качества в устойчивые рабочие процессы.", en: "Teams connect models, tools and quality controls into durable operational workflows." }, tags: ["Agents", "Workflow", "API"], read: 5 },
  { id: 2, category: "research", image: "/ai-universe/deepseek-v15.png", source: "Research", title: { ru: "Модели рассуждений становятся рабочим инструментом", en: "Reasoning models become operational tools" }, description: { ru: "Исследования смещаются от демонстраций к измеримым задачам программирования и анализа.", en: "Research moves from demos toward measurable coding and analysis tasks." }, tags: ["LLM", "Research", "Reasoning"], read: 7 },
  { id: 3, category: "robotics", image: "/projects/warehouse/main.png", source: "Robotics", title: { ru: "Робототехника соединяет зрение и действие", en: "Robotics connects vision and action" }, description: { ru: "Компьютерное зрение и планирование движений формируют новый слой складской автоматизации.", en: "Computer vision and motion planning form a new layer of warehouse automation." }, tags: ["Robotics", "Vision", "Industry"], read: 4 },
  { id: 4, category: "automation", image: "/projects/n8n_news/1.png", source: "n8n", title: { ru: "Автоматизации координируют AI-операции", en: "Automation coordinates AI operations" }, description: { ru: "События, память и интеграции собираются в прозрачные процессы с участием человека.", en: "Events, memory and integrations become transparent human-in-the-loop processes." }, tags: ["Automation", "AI", "Workflows"], read: 6 },
  { id: 5, category: "startups", image: "/ai-universe/openhands-clean.png", source: "Venture Signal", title: { ru: "Универсальные роботы выходят в пилотные проекты", en: "Generalist robots enter industrial pilots" }, description: { ru: "Стартапы проверяют, как одна аппаратная платформа работает в нескольких средах.", en: "Startups test how one hardware platform can work across several environments." }, tags: ["Startup", "Hardware", "Robotics"], read: 3 },
  { id: 6, category: "ai", image: "/ai-universe/qwen-v10.png", source: "AI Research", title: { ru: "Мультимодальные системы ускоряют исследовательскую работу", en: "Multimodal systems accelerate research workflows" }, description: { ru: "Текст, изображение и структурированные данные анализируются в одном рабочем контуре.", en: "Text, imagery and structured data are analyzed in one working context." }, tags: ["Multimodal", "Research", "AI"], read: 6 },
] as const;

const categories: { id: FeedCategory; ru: string; en: string }[] = [
  { id: "all", ru: "Все", en: "All" },
  { id: "ai", ru: "ИИ", en: "AI" },
  { id: "agents", ru: "Агенты", en: "Agents" },
  { id: "robotics", ru: "Робототехника", en: "Robotics" },
  { id: "automation", ru: "Автоматизация", en: "Automation" },
  { id: "research", ru: "Исследования", en: "Research" },
  { id: "startups", ru: "Стартапы", en: "Startups" },
];

const feedLabels: Record<string, { ru: string; en: string }> = {
  "AI Lab": { ru: "Лаборатория ИИ", en: "AI Lab" },
  Research: { ru: "Исследования", en: "Research" },
  Robotics: { ru: "Робототехника", en: "Robotics" },
  "Venture Signal": { ru: "Венчурный сигнал", en: "Venture Signal" },
  "AI Research": { ru: "ИИ-исследования", en: "AI Research" },
  Agents: { ru: "Агенты", en: "Agents" },
  Workflow: { ru: "Процесс", en: "Workflow" },
  Reasoning: { ru: "Рассуждения", en: "Reasoning" },
  Vision: { ru: "Зрение", en: "Vision" },
  Industry: { ru: "Индустрия", en: "Industry" },
  Automation: { ru: "Автоматизация", en: "Automation" },
  Workflows: { ru: "Процессы", en: "Workflows" },
  Startup: { ru: "Стартап", en: "Startup" },
  Hardware: { ru: "Оборудование", en: "Hardware" },
  Multimodal: { ru: "Мультимодальность", en: "Multimodal" },
  AI: { ru: "ИИ", en: "AI" },
};

function feedLabel(value: string, locale: "ru" | "en") {
  return feedLabels[value]?.[locale] ?? value;
}

const copy = {
  ru: {
    number: "03", title: "Лента будущего.", intro: "Свежие сигналы из ИИ, робототехники, автоматизации и технологий будущего.", live: "В эфире", updates: "Редакционная лента", curated: "Собрано Den’s Workspace", refreshed: "Обновить ленту", detected: "новых сигналов", sort: "Сортировка", newest: "Сначала новые", important: "По важности", read: "мин чтения", sideTitle: "Хотите такую ленту для своего бизнеса?", sideText: "Я создаю системы мониторинга, которые собирают, фильтруют и кратко объясняют информацию для вашей отрасли.", build: "Создать автоматическую ленту", book: "Обсудить стратегию", footer: "Собственные источники. Релевантные сигналы. Более точные решения.", services: ["Мониторинг конкурентов", "Отслеживание ИИ-исследований", "Отраслевая аналитика", "Рыночные сигналы", "Брифинги для руководителей", "Операционные дашборды"],
  },
  en: {
    number: "03", title: "Live Future Feed.", intro: "Fresh signals from AI, robotics, automation and future technology.", live: "Live", updates: "Editorial feed", curated: "Curated by Den’s Workspace", refreshed: "Refresh feed", detected: "new signals", sort: "Sort by", newest: "Newest", important: "Most important", read: "min read", sideTitle: "Want this feed inside your business?", sideText: "I build intelligence feeds that collect, filter and summarize information specific to your industry.", build: "Build an automated feed", book: "Book strategy session", footer: "Custom sources. Relevant signals. Smarter decisions.", services: ["Competitor monitoring", "AI research tracking", "Industry intelligence", "Market signals", "Founder briefings", "Executive dashboards"],
  },
} as const;

export default function NewsFeedPage({ articles }: { articles?: { ru: EditorialArticle[]; en: EditorialArticle[] } }) {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const [category, setCategory] = useState<FeedCategory>("all");
  const [sort, setSort] = useState<"newest" | "important">("newest");
  const [refreshing, setRefreshing] = useState(false);
  const t = copy[locale];

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const localizedItems = useMemo(() => {
    const live = articles?.[locale] ?? [];
    if (live.length === 0) return feedItems.map(item => ({ id: String(item.id), slug: null as string | null, category: item.category, image: item.image, source: item.source, title: item.title[locale], description: item.description[locale], tags: [...item.tags], read: item.read }));
    return live.map(item => ({ id: item.id, slug: item.slug, category: normalizeCategory(item.category), image: item.imageUrl ?? "/ai-universe/chatgpt-v13.png", source: item.sourceName, title: item.title, description: item.summary, tags: item.tags, read: Math.max(2, Math.ceil(item.body.split(/\s+/).length / 190)) }));
  }, [articles, locale]);

  const visibleItems = useMemo(() => {
    const filtered = category === "all" ? [...localizedItems] : localizedItems.filter(item => item.category === category);
    return sort === "important" ? filtered.reverse() : filtered;
  }, [category, localizedItems, sort]);

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 650);
  };

  return <main className="news-page">
    <AmbientBackground/>
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="news"/>
    <div className="news-shell shell">
      <aside className="news-intro-panel">
        <p className="news-number">{t.number}</p>
        <h1>{t.title.replace(/\.$/, "")}<i/></h1>
        <p className="news-intro-copy">{t.intro}</p>
        <div className="news-status-card"><small>{locale === "ru" ? "СТАТУС ЛЕНТЫ" : "LIVE STATUS"}</small><strong><CircleDot/>{t.live}</strong><span>{t.updates}</span></div>
        <div className="news-powered"><Network/><p>{locale === "ru" ? "Работает на" : "Powered by"} <b>n8n</b><br/><span>{t.curated}</span></p></div>
        <div className="news-orb" aria-hidden="true"><Network/></div>
      </aside>

      <section className="news-feed-column" aria-label={locale === "ru" ? "Лента новостей" : "News feed"}>
        <div className="news-toolbar">
          <div className="news-categories">{categories.map(item => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)}>{item[locale]}</button>)}</div>
          <div className="news-controls">
            <span><Sparkles/>{visibleItems.length} {t.detected}</span>
            <button onClick={refresh}><RefreshCw className={refreshing ? "spinning" : ""}/>{t.refreshed}</button>
            <label>{t.sort}<select value={sort} onChange={event => setSort(event.target.value as "newest" | "important")}><option value="newest">{t.newest}</option><option value="important">{t.important}</option></select></label>
          </div>
        </div>

        <div className="news-list">{visibleItems.map(item => <article className="news-card" key={item.id}>
          <div className="news-card-image"><Image src={item.image} alt="" fill sizes="(max-width: 800px) 30vw, 180px"/></div>
          <div className="news-card-body"><span className={`news-category category-${item.category}`}>{categories.find(categoryItem => categoryItem.id === item.category)?.[locale]}</span><h2>{localizeAi(item.title, locale)}</h2><p>{localizeAi(item.description, locale)}</p><div className="news-meta"><b><Cpu/>{feedLabel(item.source, locale)}</b><span><Clock3/>{item.read} {t.read}</span>{item.tags.map(tag => <em key={tag}>{feedLabel(tag, locale)}</em>)}</div></div>
          {item.slug ? <Link className="news-card-arrow" href={`/news-feed/${item.slug}`} aria-label={locale === "ru" ? "Открыть материал" : "Open signal"}><ArrowRight/></Link> : <span className="news-card-arrow" aria-hidden="true"><ArrowRight/></span>}
        </article>)}</div>
      </section>

      <aside className="news-offer-panel">
        <h2>{t.sideTitle}<i/></h2><p>{t.sideText}</p>
        <ul>{t.services.map((service, index) => {
          const ServiceIcon = [SearchCheck, Sparkles, Network, TrendingUp, UserRound, LayoutDashboard][index];
          return <li key={service}><ServiceIcon size={17}/><span>{service}</span></li>;
        })}</ul>
        <div className="news-cubes" aria-hidden="true"><Boxes/></div>
        <Link className="news-offer-primary" href="/#start-conversation">{t.build}<ArrowRight/></Link>
        <Link className="news-offer-secondary" href="/#start-conversation"><CalendarDays/>{t.book}</Link>
        <p className="news-offer-foot">{t.footer}</p>
      </aside>
    </div>
  </main>;
}

function normalizeCategory(category: string): FeedCategory {
  return categories.some(item => item.id === category) ? category as FeedCategory : "ai";
}
