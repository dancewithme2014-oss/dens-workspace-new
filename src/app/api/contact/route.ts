import { NextResponse } from "next/server";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, string>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true });
  if (!body.name || body.name.length < 2 || !emailPattern.test(body.email || "") || !body.requestType || !body.message || body.message.length < 10) return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return NextResponse.json({ ok: false, error: "Contact service is not configured" }, { status: 503 });
  const resend = new Resend(RESEND_API_KEY);
  const result = await resend.emails.send({ from: CONTACT_FROM_EMAIL, to: CONTACT_TO_EMAIL, replyTo: body.email, subject: `Den's Workspace: ${body.requestType}`, text: `Name: ${body.name}\nEmail: ${body.email}\nLocale: ${body.locale}\nRequest: ${body.requestType}\n\n${body.message}` });
  if (result.error) return NextResponse.json({ ok: false, error: result.error.message }, { status: 502 });
  return NextResponse.json({ ok: true });
}
