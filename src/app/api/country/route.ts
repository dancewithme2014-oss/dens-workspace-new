import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country")
    || request.headers.get("cf-ipcountry")
    || request.headers.get("x-country-code")
    || "";

  return NextResponse.json({ country: country.toUpperCase() }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
