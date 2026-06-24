import "server-only";

import { z } from "zod";

const translatedArticleSchema = z.object({
  slug: z.string().min(1).max(220),
  title: z.string().min(1).max(220),
  summary: z.string().min(1).max(800),
  body: z.string().min(1),
  seoTitle: z.string().max(220).nullable(),
  seoDescription: z.string().max(500).nullable(),
  telegramText: z.string().max(4096).nullable(),
  englishComment: z.string().max(4096).nullable(),
  tags: z.array(z.string().min(1).max(40)).max(12),
  category: z.string().min(1).max(80),
});

export type TranslatedArticle = z.infer<typeof translatedArticleSchema>;

export type TranslationSource = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  telegramText: string | null;
  englishComment: string | null;
  tags: string[];
  category: string;
  sourceName: string | null;
  sourceUrl: string | null;
};

const translationFormat = {
  type: "json_schema",
  name: "editorial_article_translation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["slug", "title", "summary", "body", "seoTitle", "seoDescription", "telegramText", "englishComment", "tags", "category"],
    properties: {
      slug: { type: "string", description: "Lowercase English URL slug using latin letters, numbers and hyphens only." },
      title: { type: "string" },
      summary: { type: "string" },
      body: { type: "string" },
      seoTitle: { type: ["string", "null"] },
      seoDescription: { type: ["string", "null"] },
      telegramText: { type: ["string", "null"] },
      englishComment: { type: ["string", "null"] },
      tags: { type: "array", maxItems: 12, items: { type: "string" } },
      category: { type: "string" },
    },
  },
} as const;

export async function translateRussianArticleToEnglish(source: TranslationSource) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { translation: null, warning: "openai_key_missing" as const };

  const model = process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.5";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            "You are a senior bilingual editor for Den Workspace.",
            "Translate Russian editorial articles into polished, natural English.",
            "Preserve meaning, facts, Markdown structure, links, lists, headings and paragraph order.",
            "Do not add facts. Do not summarize the body unless the Russian source itself is short.",
            "Write an English editorial comment that sounds professional and concise, not machine-translated.",
            "Return only valid JSON matching the schema.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify(source),
        },
      ],
      text: { format: translationFormat },
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("OpenAI translation failed", { status: response.status, details: details.slice(0, 500) });
    return { translation: null, warning: "openai_translation_failed" as const };
  }

  const data = await response.json().catch(() => null);
  const rawText = extractOutputText(data);
  if (!rawText) return { translation: null, warning: "openai_translation_empty" as const };

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText) as unknown;
  } catch (error) {
    console.error("OpenAI translation JSON parse failed", error);
    return { translation: null, warning: "openai_translation_invalid" as const };
  }
  const parsed = translatedArticleSchema.safeParse(parsedJson);
  if (!parsed.success) {
    console.error("OpenAI translation returned invalid JSON", parsed.error.flatten());
    return { translation: null, warning: "openai_translation_invalid" as const };
  }

  return {
    translation: {
      ...parsed.data,
      slug: normalizeEnglishSlug(parsed.data.slug || source.slug || source.title),
    },
    warning: null,
    model,
  };
}

function extractOutputText(data: unknown) {
  if (!data || typeof data !== "object") return "";
  const direct = (data as { output_text?: unknown }).output_text;
  if (typeof direct === "string" && direct.trim()) return direct;

  const output = (data as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const text = (part as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) return text;
    }
  }
  return "";
}

function normalizeEnglishSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180) || "translated-article";
}
