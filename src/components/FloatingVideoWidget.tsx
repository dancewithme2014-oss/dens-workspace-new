"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Maximize2, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSitePreferences } from "@/lib/preferences";

const videoSrc = "/about/workspace.mp4";
const posterSrc = "/about/workspace.png";

export default function FloatingVideoWidget() {
  const pathname = usePathname();
  const { locale } = useSitePreferences();
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 800px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    video.play().catch(() => {
      setMuted(true);
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [expanded, muted]);

  if (isMobileViewport || pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const hello = locale === "ru" ? "Привет!" : "Hello!";
  const cta = locale === "ru" ? "Связаться" : "Get in touch";
  const eyebrow = locale === "ru" ? "Видео-визитка" : "Video intro";
  const compactTitle = locale === "ru" ? "Коротко о подходе" : "How I work";
  const compactAction = locale === "ru" ? "Смотреть" : "Watch";
  const expandedTitle = locale === "ru" ? "Den Workspace в 30 секунд" : "Den Workspace in 30 seconds";

  if (expanded) {
    return <section className="floating-video-widget expanded" aria-label={locale === "ru" ? "Видео-приветствие" : "Video introduction"}>
      <button className="floating-video-close" type="button" aria-label={locale === "ru" ? "Закрыть видео" : "Close video"} onClick={() => setExpanded(false)}><X/></button>
      <button className="floating-video-sound" type="button" aria-label={muted ? "Unmute video" : "Mute video"} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX/> : <Volume2/>}</button>
      <video ref={videoRef} src={videoSrc} poster={posterSrc} autoPlay loop playsInline muted={muted} preload="metadata"/>
      <div className="floating-video-expanded-copy">
        <span>{eyebrow}</span>
        <strong>{expandedTitle}</strong>
      </div>
      <Link className="floating-video-cta" href="/#start-conversation" onClick={() => setExpanded(false)}>{cta}<ArrowRight/></Link>
    </section>;
  }

  return <section className="floating-video-widget compact" aria-label={locale === "ru" ? "Открыть видео-приветствие" : "Open video introduction"}>
    <button className="floating-video-card" type="button" onClick={() => { setMuted(false); setExpanded(true); }}>
      <span className="floating-video-kicker">{eyebrow}</span>
      <span className="floating-video-hello">{hello}</span>
      <video src={videoSrc} poster={posterSrc} autoPlay loop muted playsInline preload="metadata"/>
      <span className="floating-video-caption">
        <strong>{compactTitle}</strong>
        <em>{compactAction}<ArrowRight/></em>
      </span>
      <span className="floating-video-expand" aria-hidden="true"><Maximize2/></span>
    </button>
  </section>;
}
