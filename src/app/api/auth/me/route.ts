import { getCurrentEditorialProfile } from "@/lib/editorial/server";

export async function GET() {
  const profile = await getCurrentEditorialProfile();
  return Response.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}
