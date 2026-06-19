import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = request.headers.get("x-den-secret");

  if (!process.env.N8N_UPLOAD_SECRET || secret !== process.env.N8N_UPLOAD_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);

  const filenameFromQuery =
    searchParams.get("filename") ||
    `news/image_${Date.now()}.png`;

  const filename = filenameFromQuery
    .replace(/^\/+/, "")
    .replace(/[^a-zA-Z0-9._/-]/g, "_");

  const contentType =
    request.headers.get("content-type") ||
    "image/png";

  const blob = await put(filename, request.body!, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });

  return NextResponse.json(blob);
}
