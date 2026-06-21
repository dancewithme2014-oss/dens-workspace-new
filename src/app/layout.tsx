import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import FloatingVideoWidget from "@/components/FloatingVideoWidget";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Den Workspace | AI Systems & Automation",
  description: "Интеллектуальные системы, автоматизация и продукты для реального бизнеса.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning data-scroll-behavior="smooth" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}<SiteFooter/><FloatingVideoWidget/><CookieConsent/></body>
    </html>
  );
}
