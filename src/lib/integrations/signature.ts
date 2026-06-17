import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyIntegrationSignature(rawBody: string, providedSignature: string | null) {
  const secret = process.env.N8N_INTEGRATION_SECRET;
  if (!secret || !providedSignature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = providedSignature.replace(/^sha256=/, "");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}
