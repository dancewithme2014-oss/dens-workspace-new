"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSitePreferences } from "@/lib/preferences";

const videoSrc = "/about/workspace.mp4";
const posterSrc = "/about/workspace.png";

export default function FloatingVideoWidget() {
  const pathname = usePathname();
  const { locale } = useSitePreferences();
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const hello = locale === "ru" ? "Привет!" : "Hello!";
  const cta = locale === "ru" ? "Связаться" : "Get in touch";

  if (expanded) {
    return <section className="floating-video-widget expanded" aria-label={locale === "ru" ? "Видео-приветствие" : "Video introduction"}>
      <button className="floating-video-close" type="button" aria-label={locale === "ru" ? "Закрыть видео" : "Close video"} onClick={() => setExpanded(false)}><X/></button>
      <button className="floating-video-sound" type="button" aria-label={muted ? "Unmute video" : "Mute video"} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX/> : <Volume2/>}</button>
      <video ref={videoRef} src={videoSrc} poster={posterSrc} autoPlay loop playsInline muted={muted} preload="metadata"/>
      <Link className="floating-video-cta" href="/#start-conversation" onClick={() => setExpanded(false)}>{cta}</Link>
    </section>;
  }

  return <section className="floating-video-widget compact" aria-label={locale === "ru" ? "Открыть видео-приветствие" : "Open video introduction"}>
    <button className="floating-video-card" type="button" onClick={() => { setMuted(false); setExpanded(true); }}>
      <span className="floating-video-hello">{hello}</span>
      <video src={videoSrc} poster={posterSrc} autoPlay loop muted playsInline preload="metadata"/>
      <span className="floating-video-expand" aria-hidden="true"><Maximize2/></span>
    </button>
  </section>;
}
