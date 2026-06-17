# Editorial workflows for n8n 2.8.3

## Recommended: one-file import

Import `dens-workspace-editorial-all-in-one.json`. It contains three branches in one workflow:

1. RSS collection, deduplication, AI rewrite and Telegram preview.
2. Telegram callback approval.
3. Site and Telegram publication queue processing.

No sub-workflow IDs are required. After import:

1. Select an OpenAI credential in `AI Editorial Rewrite`.
2. Select the same Telegram Bot credential in `Send Telegram Preview`, `Telegram Callback` and `Publish to Telegram`.
3. Configure the environment variables listed in the workflow note.
4. Set the website's `SUPABASE_SERVICE_ROLE_KEY` (or modern `sb_secret_...` server key) in the website deployment, never in browser code.
5. Add the website URL to Supabase Auth redirect URLs, including `/auth/callback`.
6. Test with `Manual test`, then activate the workflow.

If n8n blocks environment variables in expressions, allow environment access for this trusted self-hosted workflow. Code nodes use Node's built-in `crypto`; with task runners enable `crypto` in the standard-library allow list.

## Modular alternative

The six smaller templates remain available if you later want independent scaling. Import in this order:

1. `01-source-collector.json`
2. `02-normalize-dedupe.json`
3. `03-ai-editorial.json`
4. `04-telegram-approval.json`
5. `05-publisher.json`
6. `06-error-retry.json`

## Required configuration

- Replace placeholder sub-workflow IDs after import.
- Configure RSS URLs as workflow data or Supabase `sources` rows.
- Store Supabase, Telegram and LLM secrets in n8n Credentials.
- Set `DENS_SITE_URL` and `N8N_INTEGRATION_SECRET` in the n8n environment.
- Set the private Telegram group ID plus RU and EN topic IDs.
- Keep Reddit, X and Threads source/publisher branches disabled for v1.

## Signing requests

The website integration APIs reject unsigned traffic. Before each website HTTP Request, serialize the final JSON body once and calculate:

```js
const crypto = require('crypto');
const rawBody = JSON.stringify($json.payload);
const signature = crypto
  .createHmac('sha256', $env.N8N_INTEGRATION_SECRET)
  .update(rawBody)
  .digest('hex');

return [{ json: { rawBody, signature: `sha256=${signature}` } }];
```

Send `rawBody` without reformatting and set `X-Dens-Signature` to `signature`. If the Code node cannot import `node:crypto`, allow it in the n8n task-runner environment or move signing to a private webhook gateway.

## Approval buttons

Generate one token per action through `/api/integrations/approval-token`, then place only the short token in Telegram callback data. Never put the service-role key, article body or a reusable secret into callback data.

Telegram callback processing must pass:

- one-time action token;
- Telegram user ID;
- optional schedule timestamp.

The website performs the article-version check and audit logging.

## Shadow mode

Initially leave Publisher inactive. Confirm records reach `pending_approval`, images are stored correctly, citations remain intact, and the Telegram preview matches the admin preview. Then activate site publishing first and Telegram publishing second.

The Supabase tables `workflow_runs`, `publication_jobs` and `publications` are the operational source of truth. Do not use long Wait nodes as storage.
