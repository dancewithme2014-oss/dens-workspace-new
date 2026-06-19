import { z } from "zod";

export const articleStatusSchema = z.enum([
  "ingested",
  "processing",
  "draft",
  "pending_approval",
  "approved",
  "scheduled",
  "publishing",
  "published",
  "rejected",
  "failed",
]);

export const ingestionPayloadSchema = z.object({
  externalId: z.string().min(1).max(500),
  sourcePlatform: z.enum(["rss", "reddit", "x", "threads", "manual"]),
  sourceName: z.string().min(1).max(180),
  sourceUrl: z.url(),
  canonicalUrl: z.url(),
  author: z.string().max(180).nullable().optional(),
  locale: z.enum(["ru", "en"]),
  title: z.string().min(1).max(500),
  rawContent: z.string().min(1),
  imageUrl: z.url().nullable().optional(),
  publishedAt: z.iso.datetime().nullable().optional(),
  fingerprint: z.string().min(16).max(128),
  category: z.string().max(80).default("ai"),
});

export const editorialResultSchema = z.object({
  articleId: z.uuid(),
  expectedVersion: z.number().int().positive(),
  locale: z.enum(["ru", "en"]),
  title: z.string().min(1).max(220),
  summary: z.string().min(1).max(800),
  body: z.string().min(1),
  seoTitle: z.string().max(220).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  telegramText: z.string().max(4096).nullable().optional(),
  tags: z.array(z.string().min(1).max(40)).max(12).default([]),
  category: z.string().min(1).max(80),
  factWarnings: z.array(z.string().max(500)).max(20).default([]),
});

export const publicationResultSchema = z.object({
  jobId: z.uuid(),
  status: z.enum(["published", "failed"]),
  externalId: z.string().max(500).nullable().optional(),
  externalUrl: z.url().nullable().optional(),
  error: z.string().max(4000).nullable().optional(),
});

export const articleUpdateSchema = z.object({
  expectedVersion: z.number().int().positive(),
  locale: z.enum(["ru", "en"]),
  slug: z.string().min(1).max(220).regex(/^[a-z0-9а-яё]+(?:-[a-z0-9а-яё]+)*$/iu),
  title: z.string().min(1).max(220),
  summary: z.string().min(1).max(800),
  body: z.string().min(1),
  category: z.string().min(1).max(80),
  tags: z.array(z.string().min(1).max(40)).max(12),
  seoTitle: z.string().max(220).nullable(),
  seoDescription: z.string().max(500).nullable(),
  telegramText: z.string().max(4096).nullable(),
  imageUrl: z.url().nullable().optional(),
  sourceUrl: z.url().nullable().optional(),
  sourceName: z.string().max(180).nullable().optional(),
  englishComment: z.string().max(4096).nullable().optional(),
});

export const transitionSchema = z.object({
  expectedVersion: z.number().int().positive(),
  toStatus: articleStatusSchema,
  note: z.string().max(1000).nullable().optional(),
  scheduledAt: z.iso.datetime().nullable().optional(),
});

export const approvalTokenSchema = z.object({
  articleId: z.uuid(),
  articleVersion: z.number().int().positive(),
  action: z.enum(["approve", "reject", "regenerate", "schedule"]),
});

export const telegramCallbackSchema = z.object({
  token: z.string().min(32).max(256),
  telegramUserId: z.string().min(1).max(32),
  scheduledAt: z.iso.datetime().nullable().optional(),
});
