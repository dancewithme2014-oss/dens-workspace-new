import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyIntegrationSignature } from "@/lib/integrations/signature";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyIntegrationSignature(raw, request.headers.get("x-dens-signature"))) return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  revalidatePath("/news-feed");
  revalidatePath("/news-feed/[slug]", "page");
  return NextResponse.json({ revalidated: true });
}
