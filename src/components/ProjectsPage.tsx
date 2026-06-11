"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Atom, Bot, Boxes, BrainCircuit, Check, Clock3, FlaskConical, GitBranch, Layers3, Mail, MapPin, Mic2, MonitorSmartphone, Network, Orbit, Play, Radar, Rocket, Workflow } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { featuredProjects } from "@/lib/projects-data";
import type { Locale } from "@/lib/content";
import { useSitePreferences } from "@/lib/preferences";

const copy = {
  ru: {
    eyebrow: "Венчурная студия",
    title: ["Продукты.", "Системы.", "Эксперименты."],
    intro: "Растущая коллекция AI-продуктов, бизнес-систем и экспериментов, созданных для совместной работы людей и интеллектуальных систем.",
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
    response: "Ответ в течение 24–48 часов",
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
  },
  en: {
    eyebrow: "Venture studio",
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
    response: "Response within 24–48 hours",
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
  },
} as const;

const gallery: Record<string, string[]> = {
  "BizTok": ["/projects/biztok/mainscreenbt.png", "/projects/biztok/mob.jpg", "/projects/biztok/secondscreenbt.png", "/projects/biztok/thirdscreenbt.png"],
  "Virtual COO": ["/projects/Virtual COO/main.png", "/projects/Virtual COO/first.png", "/projects/Virtual COO/third.png", "/projects/Virtual COO/fourth.png"],
  "Warehouse AI": ["/projects/warehouse/main.png", "/projects/warehouse/first.jpg", "/projects/warehouse/second.jpg", "/projects/warehouse/third.png"],
  "Marketing Engine": ["/projects/n8n_news/main.jpg", "/projects/osa/mainosa.png", "/projects/osa/osa1.png", "/projects/osa/osa2.png"],
  "Den’s Workspace OS": ["/ai-universe/main-planet-v13.png", "/ai-universe/ecosystem-core.png", "/ai-universe/reference-page.png", "/landing/hero-workshop.png"],
};

const showcaseCopy = {
  ru: {
    description: "AI-платформа, которая объединяет создателей, бренды и покупателей через интерактивные live-shopping сценарии.",
    problem: "Покупки в прямом эфире разрознены, сложны и лишены данных в реальном времени.",
    solution: "BizTok объединяет трансляции, вовлечение, платежи и аналитику в одной платформе.",
    features: ["Live-трансляции", "Чат и вовлечение", "AI-рекомендации", "Платежи и аналитика"],
    focus: "Улучшаем discovery, инструменты авторов и AI-рекомендации.",
    solves: "Большинство прямых эфиров привлекают внимание, но не превращают его в продажи. BizTok сокращает путь между просмотром и покупкой.",
    founder: "Обычные каталоги помогают людям находить бизнес. Социальные сети помогают бизнесу привлекать внимание. BizTok соединяет оба мира.",
  },
  en: {
    description: "A live-commerce platform that connects creators, brands and customers through interactive shopping experiences.",
    problem: "Live shopping is fragmented, complex and lacks real-time interaction tools.",
    solution: "BizTok unifies streaming, engagement, payments and analytics in one platform.",
    features: ["Live shopping & streaming", "Real-time chat", "AI recommendations", "Payments & analytics"],
    focus: "Improving discovery, creator tools and AI recommendations.",
    solves: "Most livestreams generate attention but fail to generate transactions. BizTok was designed to reduce the distance between watching and buying.",
    founder: "Traditional directories help people find businesses. Social media helps businesses find attention. BizTok was built to connect both worlds.",
  },
} as const;

const biztokMobile = [
  "/projects/biztok/mobile/profile.jpg",
  "/projects/biztok/mobile/home.jpg",
  "/projects/biztok/mobile/discover.jpg",
  "/projects/biztok/mainscreenbt.png",
  "/projects/biztok/secondscreenbt.png",
];

const research = [
  ["AI Agents", Bot, "Exploring"], ["Voice AI", Mic2, "Testing"], ["Computer Vision", Radar, "Exploring"], ["Knowledge Systems", BrainCircuit, "Researching"],
  ["Human-AI Interfaces", Network, "Testing"], ["Robotics", Orbit, "Exploring"], ["Autonomous Workflows", Workflow, "Researching"], ["Decision Systems", Atom, "Exploring"],
] as const;

export default function ProjectsPage() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const [selected, setSelected] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [sent, setSent] = useState(false);
  const t = copy[locale];
  const project = featuredProjects[selected];
  const images = gallery[project.name];
  const detail = showcaseCopy[locale];

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };

  return <main className="projects-page projects-redesign">
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="projects"/>

    <section className="pr-hero shell">
      <div className="pr-hero-art" aria-hidden="true"><Image src="/projects/projects-hero-reference.png" alt="" fill priority sizes="70vw"/></div>
      <div className="pr-hero-copy">
        <p className="projects-eyebrow"><i/>{t.eyebrow}</p>
        <h1>{t.title[0]}<br/>{t.title[1]}<br/><strong>{t.title[2]}</strong></h1>
        <p>{t.intro}</p>
        <div><button className="projects-primary" onClick={() => jump("featured")}>{t.explore}<ArrowRight/></button><button className="projects-secondary" onClick={() => jump("connections")}>{t.map}<Layers3/></button></div>
      </div>
    </section>

    <section className="pr-section shell" id="featured">
      <ProjectsHeading title={t.featured} action={t.all}/>
      <div className="pr-featured-grid">{featuredProjects.map((item, index) => <button key={item.name} className={`pr-featured-card ${selected === index ? "selected" : ""}`} onClick={() => { setSelected(index); setActiveImage(0); jump("showcase"); }}>
        <div className="pr-card-top"><span>{item.number}</span><b className={`status ${item.status.toLowerCase()}`}>{item.status}</b></div>
        <div className="pr-card-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 78vw, 20vw"/></div>
        <h3>{item.name}</h3><p>{item.subtitle}</p><div className="pr-tags"><span>AI</span><span>Automation</span><span>{index === 2 ? "Logistics" : "Platform"}</span></div>
      </button>)}</div>
      <div className="pr-pagination"><i/><i/><i/><i/></div>
    </section>

    <section className="pr-section shell" id="showcase">
      <ProjectsHeading title={t.showcase}/>
      <div className="pr-case-study">
        <article className="pr-case-copy">
          <p className="pr-case-number">{project.number}</p>
          <h2>{project.name}</h2><p className="pr-case-subtitle">{project.subtitle}</p>
          <p className="pr-case-description">{detail.description}</p>
          <div className="pr-case-rule"/>
          <h3>{t.solves}</h3><p>{detail.solves}</p>
          <div className="pr-case-columns"><div><h3>{t.features}</h3><ul>{detail.features.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>{t.stack}</h3><ul className="pr-stack-list"><li>Next.js</li><li>Supabase</li><li>PostgreSQL</li><li>OpenAI</li><li>n8n</li><li>WebSockets</li></ul></div></div>
          <blockquote><b>{t.founder}</b><p>{detail.founder}</p></blockquote>
        </article>
        <div className="pr-case-media">
          <div className="pr-desktop-view"><Image src={images[activeImage]} alt={`${project.name} interface`} fill sizes="(max-width: 800px) 100vw, 68vw"/><span>{activeImage + 1} / {images.length}</span><button className="previous" aria-label="Previous screenshot" onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}><ArrowLeft/></button><button className="next" aria-label="Next screenshot" onClick={() => setActiveImage((activeImage + 1) % images.length)}><ArrowRight/></button></div>
          <div className="pr-desktop-thumbs">{images.map((image, index) => <button className={activeImage === index ? "active" : ""} key={image} onClick={() => setActiveImage(index)} aria-label={`Show screenshot ${index + 1}`}><Image src={image} alt="" fill sizes="14vw"/></button>)}</div>
          <div className="pr-mobile-support">
            <div className="pr-mobile-copy"><div className="pr-mobile-title"><MonitorSmartphone/><span>{t.mobile}</span></div><p>{t.mobileText}</p><ul>{t.mobileBullets.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div className="pr-mobile-screens">{(selected === 0 ? biztokMobile : [...images, images[0]].slice(0, 5)).map((image, index) => <figure key={`${image}-${index}`}><div><Image src={image} alt={`${project.name} mobile screen ${index + 1}`} fill sizes="(max-width: 700px) 48vw, 10vw"/></div></figure>)}</div>
          </div>
        </div>
      </div>
    </section>

    <section className="pr-section shell" id="connections">
      <ProjectsHeading title={t.connections}/>
      <SystemConnections locale={locale}/>
    </section>

    <section className="pr-section shell" id="research">
      <ProjectsHeading title={t.research}/><p className="pr-section-note">{t.researchNote}</p>
      <div className="pr-research-grid">{research.map(([name, Icon, state], index) => <article key={name}><div><Icon/></div><h3>{name}</h3><b className={`research-state state-${index % 4}`}>{state}</b></article>)}</div>
      <div className="pr-pagination"><i/><i/><i/></div>
    </section>

    <section className="pr-contact shell" id="contact">
      <div className="pr-contact-copy"><p className="pr-contact-kicker">{t.contactQuestion}</p><h2>{t.contact}<strong>{t.contactAccent}</strong></h2><p>{t.contactPrompt}</p><div className="pr-contact-meta"><a href="mailto:hello@densworkspace.com"><Mail/>hello@densworkspace.com</a><span><MapPin/>Global · Remote</span><span><Clock3/>{t.response}</span><a href="https://github.com/dancewithme2014-oss" target="_blank" rel="noreferrer"><GitBranch/>GitHub</a></div></div>
      <form onSubmit={submit}><div><label>{t.name}<input name="name" required placeholder={locale === "ru" ? "Ваше имя" : "John Doe"}/></label><label>{t.email}<input name="email" type="email" required placeholder="john@company.com"/></label></div><label>{t.message}<textarea name="message" required placeholder={locale === "ru" ? "Расскажите о вашей идее или проекте..." : "Tell me about your idea or project..."}/></label><button>{sent ? <><Check/>{t.success}</> : <>{t.send}<ArrowRight/></>}</button></form>
    </section>
  </main>;
}

function ProjectsHeading({ title, action }: { title: string; action?: string }) {
  return <div className="pr-heading"><h2>{title}<i/></h2>{action && <a href="#showcase">{action}<ArrowRight/></a>}</div>;
}

function SystemConnections({ locale }: { locale: Locale }) {
  const labels = locale === "ru" ? ["Общая инфраструктура", "Общие автоматизации", "AI-процессы", "Общие знания"] : ["Shared Infrastructure", "Shared Automations", "AI Workflows", "Shared Knowledge"];
  return <div className="pr-connections">
    <aside>{labels.map((label, index) => <p key={label}><i className={`dot-${index}`}/>{label}</p>)}</aside>
    <div className="pr-system-map">
      <svg viewBox="0 0 760 340" aria-hidden="true"><g>{[[380,170,170,75],[380,170,590,75],[380,170,650,200],[380,170,540,285],[380,170,235,280],[380,170,105,205]].map((line,index)=><line key={index} x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]}/>)}</g></svg>
      <div className="system-core"><b>D</b><small>Den’s Workspace</small></div>
      <SystemNode className="n1" icon={Layers3} label="Virtual COO"/><SystemNode className="n2" icon={Boxes} label="Warehouse AI"/><SystemNode className="n3" icon={FlaskConical} label="Research Systems"/><SystemNode className="n4" icon={Network} label="Experiments"/><SystemNode className="n5" icon={Rocket} label="Marketing Engine"/><SystemNode className="n6" icon={Play} label="BizTok"/>
    </div>
    <aside><h3>Warehouse AI</h3><small>Inventory Intelligence System</small><p>Computer vision and AI for real-time inventory tracking and predictive analytics.</p><b>{locale === "ru" ? "Связи" : "Connections"}</b><ul><li>Shares AI Models</li><li>Shares Automations</li><li>Core Infrastructure</li></ul></aside>
  </div>;
}

function SystemNode({ className, icon: Icon, label }: { className: string; icon: typeof Layers3; label: string }) {
  return <div className={`system-node ${className}`}><span><Icon/></span><b>{label}</b></div>;
}
