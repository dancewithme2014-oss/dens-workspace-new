# Den Workspace Editorial Platform v2

Import this workflow into n8n 2.8.3:

`/Users/mila/Desktop/Den Workspace - Editorial Platform v2 - Future Debate Ready.json`

The same file is also stored in the repo:

`/Users/mila/dens-workspace/n8n/den-workspace-editorial-platform-v2-future-debate-ready.json`

For the existing AI News Radar bot, keep the Supabase-direct workflow:

`/Users/mila/Desktop/Den Workspace - AI News Radar DW Bot - Embedded Variables.json`

That workflow writes editorial rows directly into `public.editorial_drafts`. The website reads the same Supabase table for the admin queue and published news feed, so `/api/integrations/ingest` and `/api/integrations/editorial` are not required for this bot.

## What The Platform v2 Workflow Does

Sources -> Normalize -> Website ingest API -> AI rewrite -> Website editorial API -> Telegram approval -> Publish jobs -> Website/Telegram publishing.

It is designed so approved drafts appear in the Den Workspace admin panel through the existing integration endpoints, not by writing directly into admin UI state.

For the AI News Radar Supabase-direct bot, the flow is:

News selection -> AI opinion article -> Supabase `editorial_drafts` insert -> website admin reads and edits `editorial_drafts` -> admin publishes by setting `status = published`.

## Required n8n Environment Variables

Set these in your n8n environment before activating the workflow:

```bash
DENS_SITE_URL=https://your-domain.com
N8N_INTEGRATION_SECRET=the-same-secret-as-your-website

DW_RSS_FEEDS=https://example.com/feed.xml,https://example.com/rss
DW_HN_QUERIES=AI robotics,autonomous agents,future of work
DW_YOUTUBE_QUERIES=AI robotics debate,future of AI agents
YOUTUBE_API_KEY=your-youtube-data-api-key
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-workers-ai-token

TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_APPROVAL_CHAT_ID=your-private-approval-chat-id
TELEGRAM_APPROVAL_TOPIC_RU=optional-topic-id
TELEGRAM_APPROVAL_TOPIC_EN=optional-topic-id
TELEGRAM_PUBLIC_CHAT_ID=your-public-channel-or-group-id

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`N8N_INTEGRATION_SECRET` must match the website variable with the same name. The workflow signs all private website API requests with `x-dens-signature`.

For the AI News Radar Supabase-direct bot, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CLOUDFLARE_API_TOKEN` are the important variables. The bot does not need `N8N_INTEGRATION_SECRET` for saving drafts, because it inserts into Supabase directly.

## Credentials To Select After Import

Open the imported workflow and set credentials on these nodes:

- `AI Editorial Rewrite`: OpenAI credential.
- `Telegram Callback`: Telegram credential.
- `Publish to Telegram`: Telegram credential.

The workflow file intentionally does not contain credential IDs, tokens, chat IDs, or API keys.

## Website Requirements

The website must have Supabase configured and these variables available:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_INTEGRATION_SECRET=
TELEGRAM_ALLOWED_USER_IDS=
```

The editorial SQL migration must already be applied in Supabase.

## How To Test Platform v2

1. Keep the workflow inactive after import.
2. Fill all env variables and select credentials.
3. Run `Manual Test`.
4. Check n8n execution output after `Save Editorial Result`.
5. Open `/admin/articles` on the website.
6. A new article should appear with status `pending_approval`.
7. Check the Telegram approval chat for Approve / Reject / Regenerate buttons.
8. Approve one item and verify publication jobs are created.
9. Activate the workflow only after the manual path works.

## How To Test AI News Radar Supabase Direct

1. Run the AI News Radar workflow manually.
2. Confirm that n8n inserts one row into `public.editorial_drafts`.
3. Open `/admin/articles` on the website.
4. The new Supabase draft should appear in the admin queue.
5. Open it, edit title/body/SEO/Telegram text, and click `Сохранить`.
6. Click `Опубликовать на сайт`.
7. Open `/news-feed`; the material should be visible because the website reads published `editorial_drafts` from Supabase.

## Notes For Future Debate Radar

The workflow uses patterns from Future Debate Radar:

- HN query collection.
- YouTube search and comments as opinion signals.
- RSS collection.
- Optional expansion points for Reddit, X, Threads, and Apify.

The important difference for the AI News Radar bot is that Supabase is the source of truth. n8n writes directly to `editorial_drafts`, and the website reads and edits that same table.
