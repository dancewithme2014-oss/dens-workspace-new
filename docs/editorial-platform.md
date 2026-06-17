# Den's Workspace Editorial Platform

## Architecture

The editorial source of truth is Supabase. n8n executions are short-lived workers:

`Sources -> Normalize/Dedupe -> AI Editorial -> Approval -> Publication Jobs -> Publishers`

The website and Telegram operate on the same article ID and version. Approvals use optimistic locking through `expected_version`, so an old Telegram message cannot publish a newer edit accidentally.

## 1. Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/202606150001_editorial_platform.sql` in the SQL editor or through the Supabase CLI.
3. In Authentication, disable public sign-up and keep email Magic Link enabled.
4. Set the Site URL and redirect URLs:
   - production: `https://your-domain.com/auth/callback`
   - local: `http://localhost:3000/auth/callback`
5. Invite the owner and editors from the Supabase dashboard.
6. After the owner's first login, promote the profile once:

```sql
update public.profiles
set role = 'owner'
where email = 'owner@example.com';
```

The migration creates:

- invite-only roles: `owner`, `editor`;
- public read access only for published, non-archived articles;
- private draft media and public published media buckets;
- article revisions, audit events, approval tokens and publication jobs;
- atomic `transition_article` and `save_article_localization` functions;
- explicit Data API grants in addition to RLS policies.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

## 2. Environment

Copy `.env.example` to `.env.local` and fill the values. Generate `N8N_INTEGRATION_SECRET` with at least 32 random bytes. Use the same secret in n8n's environment.

The signed integration endpoints are:

- `POST /api/integrations/ingest`
- `POST /api/integrations/editorial`
- `POST /api/integrations/approval-token`
- `POST /api/integrations/telegram-callback`
- `POST /api/integrations/publications`
- `POST /api/integrations/revalidate`

Every request must include:

```text
X-Dens-Signature: sha256=<hex HMAC-SHA256 of the exact raw request body>
```

## 3. Telegram

1. Create one private approval group.
2. Enable topics and add separate `RU Editorial` and `EN Editorial` topics.
3. Add the bot as an administrator with permission to post and edit messages.
4. Add only trusted Telegram user IDs to `TELEGRAM_ALLOWED_USER_IDS`.
5. Generate a separate one-time token for every action and article revision through `/api/integrations/approval-token`.

The website validates the Telegram user, token hash, expiry, one-time use and article version before changing status.

## 4. n8n 2.8.3

Import the files from `n8n/editorial` in numeric order. Keep credentials in n8n Credentials and identifiers in environment variables. Do not paste credentials, chat IDs or webhook paths into exported JSON.

Recommended activation sequence:

1. Run Sources, Normalize/Dedupe and AI Editorial in shadow mode.
2. Confirm source attribution, deduplication and structured output.
3. Enable Telegram previews and approval callbacks.
4. Enable Publisher for website and Telegram.
5. Enable Error/Retry and monitor `workflow_runs` and `publication_jobs`.
6. Only then deactivate the legacy workflow.

X, Reddit and Threads adapters remain disabled until their official API credentials and platform policies are confirmed.

## 5. Admin panel

- `/admin/login` sends a Supabase Magic Link.
- `/admin` shows queue state.
- `/admin/articles` searches and filters content.
- `/admin/articles/[id]` edits RU and EN independently, previews content and changes status.
- `/admin/profile` shows the active account.
- `/admin/settings` owns language and theme preferences.

The burger account area shows `Log In` for guests and the editorial account menu after authentication.

## 6. Publication lifecycle

Approving or scheduling an article atomically creates separate idempotent jobs for `site` and `telegram`. A publisher claims due jobs, reports the result to `/api/integrations/publications`, and calls `/api/integrations/revalidate` after the website publish succeeds.

Deleting a published article should set `archived_at`; publication history is retained.

## 7. Acceptance checks

- Same URL/fingerprint is ingested once.
- Stale Telegram and admin approvals return a version conflict.
- A missing RU or EN localization never appears in the other feed.
- Anonymous clients can read published content only.
- Editors cannot manage users or owner-only settings.
- Replayed publication callbacks do not create a second external post.
- Failed jobs retain the error and can be retried without changing article content.
