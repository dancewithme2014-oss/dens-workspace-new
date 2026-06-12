"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, AudioLines, Bot, BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, ChartPie, Check, Clock3, CloudCog, Database, Eye, FileText, Globe2, Mail, Megaphone, MessageSquareText, Network, PenLine, PhoneOff, Rocket, Sparkles, Workflow } from "lucide-react";
import { content, newsItems, projects, solutions, workItems } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import { useSitePreferences } from "@/lib/preferences";

const iconMap = { phone: PhoneOff, audio: AudioLines, chart: ChartNoAxesCombined, file: FileText, workflow: Workflow, clock: Clock3, database: Database, pie: ChartPie, eye: Eye, megaphone: Megaphone, pen: PenLine, rocket: Rocket };
const workIcons = [CloudCog, BriefcaseBusiness, Bot, Network];

export default function Landing() {
  const router = useRouter();
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = content[locale];
  const langIndex = locale === "ru" ? 0 : 1;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
    <AmbientBackground/>
    <SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} active="home"/>

    <section className="hero shell" id="top">
      <div className="hero-copy">
        <p className="system"><i/>{t.status}<b>{t.operational}</b></p>
        <h1>{t.heroTitle}</h1>
        <p className="kicker">{t.kicker}</p>
        <p className="intro">{t.intro}</p>
        <div className="hero-buttons"><button className="primary" onClick={() => router.push("/projects")}>{t.explore}<ArrowDownRight/></button><button className="text-button" onClick={() => scrollTo("ai-business")}>{t.work}<i/></button></div>
      </div>
      <div className="hero-panels">
        <InfoPanel title={t.working} items={workItems} icons={workIcons} action={t.allExperiments}/>
        <InfoPanel title={t.news} items={newsItems} action={t.allNews}/>
      </div>
      <div className="hero-image" aria-hidden="true">
        <div className="hero-media-desktop">
          <video className="theme-art theme-art-dark" src="/landing/hero-robot-dark.mp4" autoPlay muted loop playsInline preload="auto" />
          <video className="theme-art theme-art-light" src="/landing/hero-robot-light.mp4" autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="hero-media-mobile">
          <Image className="theme-art theme-art-dark" src="/landing/hero-robot-dark.png" alt="" fill sizes="100vw"/>
          <Image className="theme-art theme-art-light" src="/landing/hero-robot-light.png" alt="" fill sizes="100vw"/>
        </div>
      </div>
    </section>

    <section className="section shell" id="projects">
      <SectionHead eyebrow={t.featured} title={t.projectsTitle} action={t.allProjects} onAction={() => router.push("/projects")}/>
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

function AmbientBackground() {
  return <div className="ambient-background" aria-hidden="true">
    <div className="ambient-wash"/>
    <svg className="neural-layer neural-layer-far" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <g className="neural-lines">
        <path d="M-80 170 C180 90 315 275 535 215 S875 30 1095 150 S1415 330 1680 175"/>
        <path d="M-40 590 C210 470 315 675 565 555 S930 430 1160 585 S1440 740 1650 630"/>
        <path d="M120 930 C310 760 500 915 690 785 S1040 650 1225 805 S1470 970 1640 825"/>
        <path d="M185 -80 C305 160 205 315 390 455 S690 640 620 880 S790 1080 940 1160"/>
        <path d="M1120 -90 C970 145 1165 300 1005 470 S790 735 970 930 S1190 1080 1280 1160"/>
      </g>
      <g className="neural-nodes">
        <circle cx="183" cy="131" r="4"/><circle cx="405" cy="239" r="2.5"/><circle cx="650" cy="153" r="3.5"/>
        <circle cx="915" cy="93" r="2.5"/><circle cx="1160" cy="190" r="4"/><circle cx="1435" cy="284" r="2.5"/>
        <circle cx="155" cy="521" r="2.5"/><circle cx="397" cy="613" r="4"/><circle cx="684" cy="501" r="2.5"/>
        <circle cx="972" cy="493" r="3"/><circle cx="1240" cy="638" r="4"/><circle cx="1482" cy="686" r="2.5"/>
        <circle cx="264" cy="826" r="3.5"/><circle cx="583" cy="855" r="2.5"/><circle cx="895" cy="721" r="4"/>
        <circle cx="1138" cy="758" r="2.5"/><circle cx="1370" cy="900" r="3.5"/>
      </g>
    </svg>
    <svg className="neural-layer neural-layer-near" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <g className="neural-lines">
        <path d="M20 350 L260 265 L470 375 L735 280 L940 395 L1220 295 L1580 405"/>
        <path d="M105 730 L365 640 L610 745 L860 630 L1090 735 L1370 620 L1610 700"/>
        <path d="M260 265 L365 640 M470 375 L610 745 M735 280 L860 630 M940 395 L1090 735 M1220 295 L1370 620"/>
      </g>
      <g className="neural-nodes">
        <circle cx="260" cy="265" r="3"/><circle cx="470" cy="375" r="4"/><circle cx="735" cy="280" r="2.5"/>
        <circle cx="940" cy="395" r="3"/><circle cx="1220" cy="295" r="4"/><circle cx="365" cy="640" r="3"/>
        <circle cx="610" cy="745" r="4"/><circle cx="860" cy="630" r="2.5"/><circle cx="1090" cy="735" r="3"/>
        <circle cx="1370" cy="620" r="4"/>
      </g>
    </svg>
    <div className="ambient-particles"/>
    <div className="ambient-noise"/>
  </div>;
}

function InfoPanel({ title, items, icons, action }: { title: string; items: readonly (readonly string[])[]; icons?: typeof workIcons; action: string }) {
  return <article className="info-panel"><h2>{title}<i/></h2><div>{items.map((item, index) => { const Icon = icons?.[index] || Sparkles; return <p key={item[0]}><Icon/><span>{item[0]}</span><small>{item[1]}</small></p>; })}</div><button>{action}<ArrowRight/></button></article>;
}
function SectionHead({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action: string; onAction?: () => void }) { return <div className="section-head"><div><p>{eyebrow}</p><h2>{title}<i/></h2></div><button type="button" onClick={onAction}>{action}<ArrowRight/></button></div>; }
function ContactItem({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) { return <li><Icon/><div><b>{title}</b><span>{text}</span></div></li>; }
