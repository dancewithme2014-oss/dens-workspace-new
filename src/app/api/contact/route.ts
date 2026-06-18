import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findPhoneCountry } from "@/lib/phone-countries";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, string>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true });
  const phoneCountry = findPhoneCountry(body.phoneCountry);
  const phone = (body.phone || "").replace(/\D/g, "");
  if (!body.name || body.name.length < 2 || !emailPattern.test(body.email || "") || !phoneCountry || phone.length < phoneCountry.min || phone.length > phoneCountry.max || !body.requestType || !body.message || body.message.length < 10) return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  if (process.env.TURNSTILE_SECRET_KEY && !(await verifyTurnstileToken(body.turnstileToken, request))) {
    return NextResponse.json({ ok: false, error: "Security check failed" }, { status: 400 });
  }
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, TELEGRAM_BOT_TOKEN, TELEGRAM_CONTACT_CHAT_ID, TELEGRAM_CONTACT_THREAD_ID } = process.env;
  const hasEmailDelivery = !!(RESEND_API_KEY && CONTACT_TO_EMAIL && CONTACT_FROM_EMAIL);
  const hasTelegramDelivery = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CONTACT_CHAT_ID);
  if (!hasEmailDelivery && !hasTelegramDelivery) return NextResponse.json({ ok: false, error: "Contact service is not configured" }, { status: 503 });

  try {
    if (hasEmailDelivery) {
      const resend = new Resend(RESEND_API_KEY);
      const result = await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        replyTo: body.email,
        subject: `Den Workspace: ${body.requestType}`,
        text: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${phoneCountry.dial}${phone}\nLocale: ${body.locale}\nRequest: ${body.requestType}\n\n${body.message}`,
      });
      if (result.error) return NextResponse.json({ ok: false, error: result.error.message }, { status: 502 });
    }

    if (hasTelegramDelivery) {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONTACT_CHAT_ID,
          message_thread_id: TELEGRAM_CONTACT_THREAD_ID ? Number(TELEGRAM_CONTACT_THREAD_ID) : undefined,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          text: formatTelegramLead({
            name: body.name,
            email: body.email,
            phone: `${phoneCountry.dial}${phone}`,
            locale: body.locale,
            requestType: body.requestType,
            message: body.message,
          }),
        }),
      });
      if (!response.ok) {
        const telegramError = await response.text();
        return NextResponse.json({ ok: false, error: telegramError || "Telegram delivery failed" }, { status: 502 });
      }
    }
  } catch {
    return NextResponse.json({ ok: false, error: "Contact delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function formatTelegramLead({ name, email, phone, locale, requestType, message }: {
  name: string;
  email: string;
  phone: string;
  locale?: string;
  requestType: string;
  message: string;
}) {
  return [
    "<b>New Lead</b>",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    `<b>Phone:</b> ${escapeHtml(phone)}`,
    `<b>Locale:</b> ${escapeHtml(locale || "-")}`,
    `<b>Request Type:</b> ${escapeHtml(requestType)}`,
    "",
    `<b>Message:</b>\n${escapeHtml(message)}`,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function verifyTurnstileToken(token: string | undefined, request: Request) {
  if (!token) return false;

  const formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
  formData.append("response", token);
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) formData.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: formData });
    const result = await response.json() as { success?: boolean };
    return !!result.success;
  } catch {
    return false;
  }
}
