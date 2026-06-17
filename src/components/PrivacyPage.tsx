"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";
import SiteHeader from "@/components/SiteHeader";
import { useSitePreferences } from "@/lib/preferences";

const copy = {
  ru: {
    title: "Обработка персональных данных", updated: "Последнее обновление: 13 июня 2026 года",
    intro: "Эта политика объясняет, какие данные Den’s Workspace получает через сайт и как они используются.",
    sections: [
      ["Какие данные мы собираем", "Данные, которые вы добровольно отправляете через контактную форму: имя, email, телефон, тип запроса и сообщение. Также сервер может обрабатывать технические данные запроса, необходимые для безопасности и определения кода страны."],
      ["Для чего используются данные", "Чтобы ответить на обращение, подготовить предложение, обеспечить безопасность сайта и, при наличии согласия, анализировать качество работы сайта."],
      ["Cookie и согласие", "Необходимые cookie и локальное хранилище используются для языка, темы и сохранения настроек конфиденциальности. Аналитические и маркетинговые технологии не должны запускаться до вашего согласия. Вы можете изменить выбор через ссылку «Настройки cookie» внизу страницы."],
      ["Передача и хранение", "Данные формы могут обрабатываться поставщиком отправки email Resend и инфраструктурой хостинга. Мы не продаем персональные данные. Срок хранения ограничивается временем, необходимым для обработки обращения и выполнения юридических обязательств."],
      ["Ваши права", "В зависимости от вашей юрисдикции вы можете запросить доступ, исправление, удаление, ограничение обработки или перенос данных, а также отозвать согласие. Сигнал Global Privacy Control учитывается как отказ от необязательных категорий cookie."],
      ["Контакты", "По вопросам конфиденциальности и обработки данных напишите на hello@densworkspace.com."],
    ], back: "На главную",
  },
  en: {
    title: "Privacy Policy", updated: "Last updated: June 13, 2026",
    intro: "This policy explains what information Den’s Workspace receives through this website and how it is used.",
    sections: [
      ["Information we collect", "Information you voluntarily submit through the contact form: name, email, phone number, request type and message. The server may also process request metadata required for security and country-code detection."],
      ["How information is used", "To respond to inquiries, prepare proposals, protect the website and, where consent is given, understand and improve site performance."],
      ["Cookies and consent", "Necessary cookies and local storage support language, theme and privacy preferences. Analytics and marketing technologies must not run before consent. You can change your choice through the Cookie settings link in the footer."],
      ["Sharing and retention", "Contact-form data may be processed by the email provider Resend and hosting infrastructure. We do not sell personal information. Data is retained only as long as needed to handle the inquiry and meet legal obligations."],
      ["Your rights", "Depending on your jurisdiction, you may request access, correction, deletion, restriction or portability, and withdraw consent. A Global Privacy Control signal is honored as an opt-out from non-essential cookie categories."],
      ["Contact", "For privacy and data-processing questions, email hello@densworkspace.com."],
    ], back: "Back home",
  },
} as const;

export default function PrivacyPage() {
  const { locale, setLocale, theme, setTheme } = useSitePreferences();
  const t = copy[locale];
  return <main className="editorial-page privacy-page"><AmbientBackground/><SiteHeader locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme}/><article className="privacy-content shell"><Link href="/"><ArrowLeft/>{t.back}</Link><p className="projects-eyebrow">Den’s Workspace</p><h1>{t.title}<i/></h1><p className="privacy-updated">{t.updated}</p><p className="privacy-intro">{t.intro}</p>{t.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</article></main>;
}
