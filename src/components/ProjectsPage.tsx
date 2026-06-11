"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Box, ChevronDown, ExternalLink, Globe2, Grid2X2, Layers3, List, Menu, Moon, Rocket, Sun, Users, X } from "lucide-react";
import { compactProjects, featuredProjects, researchAreas } from "@/lib/projects-data";
import type { Locale } from "@/lib/content";

const copy = {
  ru: {
    nav:["Главная","Проекты","Исследования","Эксперименты","Новости","Обо мне"], venture:"Венчурная студия", title:["Продукты.","Системы.","Эксперименты."], intro:"Растущее портфолио AI-продуктов, бизнес-систем, внутренних инструментов и экспериментов, созданных для решения реальных операционных задач.", explore:"Смотреть проекты", map:"Карта проектов", featured:"Избранные системы", all:"Все проекты", journey:"Путь развития", research:"Исследования и эксперименты", connections:"Связи системы", build:"Давайте создадим следующее.", strategy:"Стратегическая сессия", conversation:"Начать разговор", load:"Показать еще", overview:"Обзор", problem:"Проблема", solution:"Решение", architecture:"Архитектура", screenshots:"Экраны", stack:"Технологии", model:"Бизнес-модель", stage:"Этап", lessons:"Выводы" },
  en: {
    nav:["Home","Projects","Research","Experiments","News Feed","About"], venture:"Venture studio", title:["Products.","Systems.","Experiments."], intro:"A growing portfolio of AI products, business systems, internal tools and experiments designed to solve real operational problems.", explore:"Explore Projects", map:"View Project Map", featured:"Featured Systems", all:"All Projects", journey:"The Journey", research:"Research & Exploration", connections:"System Connections", build:"Let’s Build What’s Next.", strategy:"Book Strategy Session", conversation:"Start a Conversation", load:"Load More Projects", overview:"Overview", problem:"Problem", solution:"Solution", architecture:"Architecture", screenshots:"Screenshots", stack:"Tech Stack", model:"Business Model", stage:"Stage", lessons:"Lessons" },
} as const;

const filters = ["All","Products","AI Systems","Automation","Internal Tools","Experiments","Research"];

export default function ProjectsPage() {
  const [locale,setLocale] = useState<Locale>(() => typeof window === "undefined" ? "ru" : (localStorage.getItem("dw-locale") as Locale) || "ru");
  const [theme,setTheme] = useState<"dark"|"light">(() => typeof window === "undefined" ? "dark" : (localStorage.getItem("dw-theme") as "dark"|"light") || "dark");
  const [menu,setMenu] = useState(false);
  const [filter,setFilter] = useState("All");
  const [grid,setGrid] = useState(true);
  const t = copy[locale];

  useEffect(() => { document.documentElement.lang=locale; localStorage.setItem("dw-locale",locale); },[locale]);
  useEffect(() => { document.documentElement.dataset.theme=theme; localStorage.setItem("dw-theme",theme); },[theme]);
  useEffect(() => { document.body.style.overflow=menu?"hidden":""; return()=>{document.body.style.overflow=""}; },[menu]);

  const jump = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setMenu(false); };
  const navTarget = (index:number) => index===0 ? "/" : index===1 ? "/projects" : `#${index===2?"research":index===3?"experiments":index===4?"journey":"about"}`;

  return <main className="projects-page">
    <ProjectsBackground/>
    <header className="projects-header projects-shell">
      <Link href="/" className="projects-brand">Den’s Workspace</Link>
      <nav>{t.nav.map((item,index)=><Link key={item} href={navTarget(index)} className={index===1?"active":""}>{item}</Link>)}</nav>
      <div className="projects-actions"><LanguageSelect locale={locale} setLocale={setLocale}/><ThemeSwitch locale={locale} theme={theme} setTheme={setTheme}/><button className="projects-build" onClick={()=>jump("contact")}>{locale==="ru"?"Обсудить проект":"Let’s Build"}<ArrowRight/></button><button className="projects-burger" aria-label="Menu" onClick={()=>setMenu(true)}><Menu/></button></div>
    </header>

    {menu&&<aside className="projects-menu"><div className="projects-menu-head"><Link href="/">Den’s Workspace</Link><button aria-label="Close" onClick={()=>setMenu(false)}><X/></button></div><nav>{t.nav.map((item,index)=><Link key={item} href={navTarget(index)} onClick={()=>setMenu(false)}><span>0{index+1}</span><strong>{item}</strong><ArrowDownRight/></Link>)}</nav><div className="projects-menu-controls"><LanguageSelect locale={locale} setLocale={setLocale}/><ThemeSwitch locale={locale} theme={theme} setTheme={setTheme}/></div></aside>}

    <section className="projects-hero projects-shell">
      <div className="projects-hero-copy"><p className="projects-eyebrow"><i/>{t.venture}</p><h1>{t.title[0]}<br/>{t.title[1]}<br/><strong>{t.title[2]}</strong></h1><p>{t.intro}</p><div><button className="projects-primary" onClick={()=>jump("featured")}>{t.explore}<ArrowRight/></button><button className="projects-link" onClick={()=>jump("connections")}>{t.map}<i/></button></div></div>
      <NeuralHero/>
      <div className="projects-stats"><Stat icon={Box} value="12+" label={locale==="ru"?"Проектов":"Projects"}/><Stat icon={Layers3} value="40+" label={locale==="ru"?"Систем создано":"Systems Built"}/><Stat icon={Users} value="100K+" label={locale==="ru"?"Пользователей":"Users Reached"}/><Stat icon={Rocket} value="5" label={locale==="ru"?"Активных направлений":"Active Ventures"}/></div>
    </section>

    <div className="projects-filter-bar"><div className="projects-shell"><div>{filters.map(item=><button key={item} className={filter===item?"active":""} onClick={()=>setFilter(item)}>{item}</button>)}</div><span>12+ projects <i/></span></div></div>

    <section className="projects-section projects-shell" id="featured"><SectionTitle eyebrow="Featured projects" title={t.featured}/><div className="featured-projects">{featuredProjects.map(project=><article key={project.number} className="featured-project"><div className="featured-top"><span>{project.number}</span><b className={`status ${project.status.toLowerCase()}`}>{project.status}</b></div><div className="featured-image"><Image src={project.image} alt={project.name} fill sizes="(max-width:700px) 82vw, 19vw"/></div><h3>{project.name}</h3><h4>{project.subtitle}</h4><p>{project.description}</p><div className="featured-metrics">{project.metrics.map(metric=><div key={metric[0]}><strong>{metric[0]}</strong><small>{metric[1]}</small></div>)}</div></article>)}</div></section>

    <section className="projects-section projects-shell"><div className="catalog-head"><SectionTitle eyebrow="All projects" title={t.all}/><div><button className={grid?"active":""} onClick={()=>setGrid(true)} aria-label="Grid"><Grid2X2/></button><button className={!grid?"active":""} onClick={()=>setGrid(false)} aria-label="List"><List/></button><button>Newest First<ChevronDown/></button></div></div><div className={`projects-catalog ${grid?"":"list"}`}>{compactProjects.map(project=><article key={project[0]}><span>{project[0]}</span><div><h3>{project[1]}</h3><p>{project[2]}</p></div><b className={`status ${project[3].toLowerCase()}`}>{project[3]}</b></article>)}</div><button className="load-more">{t.load}<ArrowRight/></button></section>

    <section className="project-detail projects-shell"><aside><div><span>01</span><b className="status active">Active</b></div><h2>BizTok</h2><p>Live Commerce Platform</p><p>AI-powered live shopping and engagement platform.</p><dl><dt>Category</dt><dd>Product</dd><dt>Launched</dt><dd>Jan 2024</dd><dt>Team</dt><dd>6 members</dd><dt>Website</dt><dd>biztok.app</dd></dl><button>View Live Project<ExternalLink/></button></aside><div className="detail-main"><nav>{[t.overview,t.problem,t.solution,t.architecture,t.screenshots,t.stack,t.model,t.stage,t.lessons].map((item,index)=><button className={index===0?"active":""} key={item}>{item}</button>)}</nav><div className="detail-content"><div><p>BizTok is an AI-powered live commerce platform that helps brands sell more through interactive live shopping experiences.</p><div className="detail-metrics"><strong>25K+<small>Active Users</small></strong><strong>$2.1M+<small>GMV Processed</small></strong><strong>120+<small>Live Sessions</small></strong><strong>4.8/5<small>User Rating</small></strong></div><div className="detail-tags"><span>Live Commerce</span><span>AI Recommendations</span><span>Real-time Chat</span><span>Payments</span></div></div><div className="detail-image"><Image src="/projects/biztok/mainscreenbt.png" alt="BizTok interface" fill sizes="38vw"/></div></div></div></section>

    <section className="projects-section projects-shell" id="journey"><SectionTitle eyebrow="Building in public" title={t.journey}/><div className="journey-grid"><Timeline year="2025" items={[["JAN","Launched BizTok"],["MAR","Virtual COO v1"],["MAY","Warehouse AI"]]}/><Timeline year="2026" items={[["Q1","Marketing Engine"],["Q2","Finance Copilot"],["Q3","Global Expansion"]]}/><Timeline year="Future" items={[["2027","Autonomous Business OS"],["2030+","AI Native Holding"]]}/><blockquote><b>“</b>We build in public.<br/>We share everything.<br/>Wins, losses, lessons.<br/>This is how we build the future.<small>— Den</small></blockquote></div></section>

    <section className="projects-section projects-shell" id="research"><SectionTitle eyebrow="What I’m exploring" title={t.research}/><div className="research-grid">{researchAreas.map(area=><article key={area[0]}><Image src={area[2]} alt="" fill sizes="16vw"/><div><h3>{area[0]}</h3><b>{area[1]}</b></div></article>)}</div></section>

    <section className="projects-section projects-shell" id="connections"><SectionTitle eyebrow="Project map" title={t.connections}/><div className="connections-layout"><div className="connections-legend"><span><i className="green"/>Projects</span><span><i className="cyan"/>Infrastructure</span><span><i className="purple"/>AI Models</span><span><i className="yellow"/>Automations</span></div><ConnectionsMap/><aside><h3>Virtual COO</h3><p>AI Operating System</p><p>AI executive that runs daily operations and drives business growth.</p><b>Connections</b><ul><li>Den’s Workspace OS</li><li>Data OS</li><li>Customer OS</li><li>Finance Copilot</li></ul><button>View Project<ArrowRight/></button></aside></div></section>

    <section className="projects-philosophy"><div className="projects-shell"><p>“Most products fail because they solve isolated problems.<br/>The best systems connect information, decisions and execution.”</p><b>— Den</b></div></section>
    <section className="projects-cta projects-shell" id="contact"><div><p>Ready to build</p><h2>{t.build}</h2></div><div><button className="projects-primary">{t.strategy}<ArrowRight/></button><button className="projects-secondary">{t.conversation}<ArrowRight/></button></div></section>
  </main>;
}

function Stat({icon:Icon,value,label}:{icon:typeof Box;value:string;label:string}){return <div><Icon/><strong>{value}<small>{label}</small></strong></div>}
function SectionTitle({eyebrow,title}:{eyebrow:string;title:string}){return <div className="projects-title"><p>{eyebrow}</p><h2>{title}<i/></h2></div>}
function Timeline({year,items}:{year:string;items:string[][]}){return <div className="timeline"><h3>{year}</h3>{items.map(item=><div key={item[1]}><b>{item[0]}</b><p>{item[1]}</p></div>)}</div>}
function LanguageSelect({locale,setLocale}:{locale:Locale;setLocale:(locale:Locale)=>void}){return <label className="language-select"><Globe2/><select aria-label="Language" value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="ru">RU</option><option value="en">EN</option></select><ChevronDown/></label>}
function ThemeSwitch({locale,theme,setTheme}:{locale:Locale;theme:"dark"|"light";setTheme:(theme:"dark"|"light")=>void}){const light=theme==="light";return <button className="theme-switch" role="switch" aria-checked={light} aria-label={locale==="ru"?"Переключить тему":"Toggle theme"} onClick={()=>setTheme(light?"dark":"light")}><Moon className="theme-moon"/><Sun className="theme-sun"/><span/></button>}

function ProjectsBackground(){return <div className="projects-bg" aria-hidden="true"><div/><svg viewBox="0 0 1600 1000"><path d="M0 180 C280 60 420 300 680 180 S1080 40 1280 170 S1510 260 1640 160"/><path d="M-100 660 C190 490 390 740 660 590 S1050 500 1280 650 S1530 730 1680 590"/><path d="M210 0 C310 240 190 390 390 530 S650 760 600 1000"/><path d="M1180 0 C1040 210 1190 410 1030 550 S890 820 1060 1000"/></svg></div>}
function NeuralHero(){return <div className="projects-neural"><span className="neural-label l1">AI Systems</span><span className="neural-label l2">Automation</span><span className="neural-label l3">Infrastructure</span><span className="neural-label l4">Data Intelligence</span><span className="neural-label l5">Human + AI</span><svg viewBox="0 0 800 480"><g className="hero-links"><path d="M90 240 L190 130 L310 190 L420 90 L520 180 L670 110"/><path d="M90 240 L220 330 L350 260 L460 350 L610 270 L710 390"/><path d="M190 130 L220 330 M310 190 L350 260 M420 90 L460 350 M520 180 L610 270 M670 110 L710 390"/><path d="M190 130 L420 90 M220 330 L460 350 M310 190 L520 180 M350 260 L610 270"/></g><g className="hero-nodes">{[[90,240],[190,130],[310,190],[420,90],[520,180],[670,110],[220,330],[350,260],[460,350],[610,270],[710,390],[400,220],[540,310]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%4===0?7:4}/>)}</g></svg></div>}
function ConnectionsMap(){const nodes: Array<[number,number,string]>=[[80,140,"BizTok"],[270,75,"Virtual COO"],[500,95,"Warehouse AI"],[710,190,"Marketing Engine"],[390,210,"Den’s Workspace OS"],[150,300,"Customer OS"],[340,350,"Finance Copilot"],[570,325,"FlowBuilder"]];return <div className="connections-map"><svg viewBox="0 0 800 420"><g>{nodes.flatMap((a,i)=>nodes.slice(i+1).filter((_,j)=>(i+j)%2===0).map((b,j)=><line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}/>))}</g>{nodes.map((n,i)=><g key={n[2]}><circle cx={n[0]} cy={n[1]} r={i===4?12:6}/><text x={n[0]+12} y={n[1]-10}>{n[2]}</text></g>)}</svg></div>}
