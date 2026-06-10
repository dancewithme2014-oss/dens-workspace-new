"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, AudioLines, Bot, BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, ChartPie, Check, Clock3, CloudCog, Database, Eye, FileText, Globe2, Mail, Megaphone, Menu, MessageSquareText, Moon, Network, PenLine, PhoneOff, Rocket, Settings2, Sparkles, Sun, Workflow, X } from "lucide-react";
import { content, newsItems, projects, solutions, workItems, type Locale } from "@/lib/content";

const iconMap = { phone: PhoneOff, audio: AudioLines, chart: ChartNoAxesCombined, file: FileText, workflow: Workflow, clock: Clock3, database: Database, pie: ChartPie, eye: Eye, megaphone: Megaphone, pen: PenLine, rocket: Rocket };
const workIcons = [CloudCog, BriefcaseBusiness, Bot, Network];
const ids = ["projects", "ai-business", "about", "contact"];

export default function Landing() {
  const [locale, setLocale] = useState<Locale>(() => typeof window === "undefined" ? "ru" : (localStorage.getItem("dw-locale") as Locale) || "ru");
  const [theme, setTheme] = useState<"dark" | "light">(() => typeof window === "undefined" ? "dark" : (localStorage.getItem("dw-theme") as "dark" | "light") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  const [menu, setMenu] = useState(false);
  const [settings, setSettings] = useState(false);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = content[locale];
  const langIndex = locale === "ru" ? 0 : 1;

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("dw-locale", locale);
  }, [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("dw-theme", theme);
  }, [theme]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("loading");
    const fd = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), requestType: fd.get("requestType"), message: fd.get("message"), website: fd.get("website"), locale }) });
    setFormState(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  };

  return <main>
    <header className="header shell">
      <button className="brand" onClick={() => scrollTo("top")}>Den’s Workspace</button>
      <nav className="desktop-nav">{t.nav.map((label, index) => <button key={label} onClick={() => scrollTo(ids[index])}>{label}</button>)}</nav>
      <div className="header-actions">
        <div className="settings-wrap">
          <button className="icon-button desktop-settings" aria-label="Settings" onClick={() => setSettings(!settings)}><Settings2 size={17}/></button>
          {settings && <div className="settings-menu"><button onClick={() => setLocale(locale === "ru" ? "en" : "ru")}><Globe2 size={16}/>{locale === "ru" ? "EN" : "RU"}</button><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={16}/> : <Moon size={16}/>} {theme === "dark" ? "Light" : "Dark"}</button></div>}
        </div>
        <button className="build-button" onClick={() => scrollTo("contact")}>{t.build}<ArrowRight size={15}/></button>
        <button className="icon-button burger" aria-label="Menu" onClick={() => setMenu(true)}><Menu size={21}/></button>
      </div>
    </header>

    {menu && <aside className="mobile-menu">
      <div className="mobile-menu-head"><span>Den’s Workspace</span><button className="icon-button" onClick={() => setMenu(false)} aria-label="Close"><X size={22}/></button></div>
      <nav>{t.nav.map((label, index) => <button key={label} onClick={() => scrollTo(ids[index])}><span>0{index + 1}</span><strong>{label}</strong><ArrowDownRight/></button>)}</nav>
      <div className="mobile-controls"><button onClick={() => setLocale(locale === "ru" ? "en" : "ru")}><Globe2/> {locale === "ru" ? "English" : "Русский"}</button><button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun/> : <Moon/>}{theme === "dark" ? "Light" : "Dark"}</button></div>
    </aside>}

    <section className="hero shell" id="top">
      <div className="hero-copy">
        <p className="system"><i/>{t.status}<b>{t.operational}</b></p>
        <h1>{t.heroTitle}</h1>
        <p className="kicker">{t.kicker}</p>
        <p className="intro">{t.intro}</p>
        <div className="hero-buttons"><button className="primary" onClick={() => scrollTo("projects")}>{t.explore}<ArrowDownRight/></button><button className="text-button" onClick={() => scrollTo("ai-business")}>{t.work}<i/></button></div>
      </div>
      <div className="hero-panels">
        <InfoPanel title={t.working} items={workItems} icons={workIcons} action={t.allExperiments}/>
        <InfoPanel title={t.news} items={newsItems} action={t.allNews}/>
      </div>
      <div className="hero-image"><Image src="/landing/hero-workshop.png" alt="AI robotics workshop" fill priority sizes="(max-width: 900px) 100vw, 52vw"/></div>
    </section>

    <section className="section shell" id="projects">
      <SectionHead eyebrow={t.featured} title={t.projectsTitle} action={t.allProjects}/>
      <div className="projects-row">{projects.map((project) => <article className="project-card" key={project.number}><span>{project.number}</span><div className="project-image"><Image src={project.image} alt={project.title} fill sizes="(max-width: 700px) 78vw, 20vw"/></div><h3>{project.title}</h3><p>{project.category[langIndex]}</p><b>Active</b></article>)}</div>
    </section>

    <section className="section shell" id="ai-business">
      <SectionHead eyebrow={t.business} title={t.businessTitle} action={t.allSolutions}/>
      <div className="solutions">{solutions.map((row) => <article className="solution-row" key={row.p[1]}>{[0,1,2].map((cell) => {
        const values = cell === 0 ? [row.p, row.pd] : cell === 1 ? [row.s, row.sd] : [row.r, row.rd]; const Icon = iconMap[row.icons[cell] as keyof typeof iconMap];
        return <div className="solution-cell" key={cell}><div className={`solution-icon ${cell === 2 ? "yellow" : ""}`}><Icon/></div><div><h3>{values[0][langIndex]}</h3><p>{values[1][langIndex]}</p></div>{cell < 2 && <ArrowRight className="flow"/>}</div>;
      })}</article>)}</div>
    </section>

    <section className="contact section shell" id="contact">
      <div className="contact-copy" id="about"><b>{t.contactNumber}</b><h2>{t.contactTitle}<strong>{t.contactAccent}</strong></h2><p>{t.contactText}</p><i/><p>{t.contactNote}</p></div>
      <figure className="portrait"><div><Image src="/landing/den-portrait.jpg" alt="Den" fill sizes="(max-width: 700px) 92vw, 22vw"/></div><figcaption><MessageSquareText/><p>{t.quote}</p><b>— Den’s Workspace</b></figcaption></figure>
      <div className="contact-panel">
        <div className="contact-info"><h3>{t.conversation}<i/></h3><p>{t.conversationText}</p><ul><ContactItem icon={Mail} title="Email" text="hello@densworkspace.com"/><ContactItem icon={CalendarDays} title={locale === "ru" ? "Созвон" : "Schedule a Call"} text={locale === "ru" ? "Стратегическая сессия" : "Book a strategy session"}/><ContactItem icon={Clock3} title={locale === "ru" ? "Время ответа" : "Response Time"} text="24–48 hours"/><ContactItem icon={Globe2} title={locale === "ru" ? "Локация" : "Location"} text="Global · Remote"/></ul></div>
        <form onSubmit={submit}><label>{t.name}<input name="name" required minLength={2} placeholder={locale === "ru" ? "Ваше имя" : "John Doe"}/></label><label>{t.email}<input name="email" required type="email" placeholder="john@company.com"/></label><label>{t.type}<select name="requestType" required defaultValue=""><option value="" disabled>{locale === "ru" ? "Выберите вариант" : "Select an option"}</option><option>AI Automation</option><option>Business System</option><option>AI Agent</option><option>Consulting</option></select></label><label>{t.message}<textarea name="message" required minLength={10} placeholder={locale === "ru" ? "Что вы хотите создать?" : "What are you trying to build?"}/></label><input className="honeypot" name="website" tabIndex={-1} autoComplete="off"/><button className="submit" disabled={formState === "loading"}>{formState === "loading" ? t.sending : t.send}<ArrowRight/></button>{formState === "success" && <p className="form-state success"><Check/>{t.success}</p>}{formState === "error" && <p className="form-state error">{t.error}</p>}</form>
      </div>
    </section>
    <footer className="footer shell"><span>© 2026 Den’s Workspace</span><span><i/>{t.operational}</span></footer>
  </main>;
}

function InfoPanel({ title, items, icons, action }: { title: string; items: readonly (readonly string[])[]; icons?: typeof workIcons; action: string }) {
  return <article className="info-panel"><h2>{title}<i/></h2><div>{items.map((item, index) => { const Icon = icons?.[index] || Sparkles; return <p key={item[0]}><Icon/><span>{item[0]}</span><small>{item[1]}</small></p>; })}</div><button>{action}<ArrowRight/></button></article>;
}
function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action: string }) { return <div className="section-head"><div><p>{eyebrow}</p><h2>{title}<i/></h2></div><button>{action}<ArrowRight/></button></div>; }
function ContactItem({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) { return <li><Icon/><div><b>{title}</b><span>{text}</span></div></li>; }
