# Den Workspace Editorial Platform v2

Import this workflow into n8n 2.8.3:

`/Users/mila/Desktop/Den Workspace - Editorial Platform v2 - Future Debate Ready.json`

The same file is also stored in the repo:

`/Users/mila/dens-workspace/n8n/den-workspace-editorial-platform-v2-future-debate-ready.json`

For the existing AI News Radar bot, use the cleaned site-API version:

`/Users/mila/dens-workspace/n8n/den-workspace-ai-news-radar-site-api.json`

This version does not write to `editorial_drafts`. It sends selected news to `/api/integrations/ingest`, saves the AI editorial result through `/api/integrations/editorial`, and then opens the created article in `/admin/articles`.

## What This Workflow Does

Sources -> Normalize -> Website ingest API -> AI rewrite -> Website editorial API -> Telegram approval -> Publish jobs -> Website/Telegram publishing.

It is designed so approved drafts appear in the Den Workspace admin panel through the existing integration endpoints, not by writing directly into admin UI state.

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

## How To Test

1. Keep the workflow inactive after import.
2. Fill all env variables and select credentials.
3. Run `Manual Test`.
4. Check n8n execution output after `Save Editorial Result`.
5. Open `/admin/articles` on the website.
6. A new article should appear with status `pending_approval`.
7. Check the Telegram approval chat for Approve / Reject / Regenerate buttons.
8. Approve one item and verify publication jobs are created.
9. Activate the workflow only after the manual path works.

## Notes For Future Debate Radar

The workflow uses patterns from Future Debate Radar:

- HN query collection.
- YouTube search and comments as opinion signals.
- RSS collection.
- Optional expansion points for Reddit, X, Threads, and Apify.

The important difference is that this workflow writes into the Den Workspace editorial platform through signed website APIs, so the admin panel remains the single place for editing, approval, and publishing.
