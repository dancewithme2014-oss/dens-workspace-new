create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.user_role as enum ('owner', 'editor');
create type public.article_status as enum (
  'ingested', 'processing', 'draft', 'pending_approval', 'approved',
  'scheduled', 'publishing', 'published', 'rejected', 'failed'
);
create type public.source_platform as enum ('rss', 'reddit', 'x', 'threads', 'manual');
create type public.article_locale as enum ('ru', 'en');
create type public.publication_channel as enum ('site', 'telegram', 'x', 'reddit', 'threads');
create type public.publication_status as enum ('queued', 'processing', 'published', 'failed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform public.source_platform not null,
  locale public.article_locale not null,
  endpoint text not null,
  category text not null default 'ai',
  enabled boolean not null default true,
  poll_interval_minutes integer not null default 15 check (poll_interval_minutes between 5 and 1440),
  config jsonb not null default '{}'::jsonb,
  last_polled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  platform public.source_platform not null,
  external_id text not null,
  canonical_url text not null,
  source_url text not null,
  source_name text not null,
  author text,
  locale public.article_locale not null,
  original_title text not null,
  raw_content text not null,
  image_url text,
  source_published_at timestamptz,
  fingerprint text not null,
  category text not null default 'ai',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (platform, external_id),
  unique (canonical_url),
  unique (fingerprint)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  source_item_id uuid references public.source_items(id) on delete set null,
  status public.article_status not null default 'ingested',
  category text not null default 'ai',
  tags text[] not null default '{}',
  image_url text,
  scheduled_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  version integer not null default 1 check (version > 0),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.article_localizations (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  locale public.article_locale not null,
  slug text not null,
  title text not null,
  summary text not null,
  body text not null,
  seo_title text,
  seo_description text,
  telegram_text text,
  fact_warnings text[] not null default '{}',
  translation_status text not null default 'original' check (translation_status in ('original', 'requested', 'draft', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (article_id, locale),
  unique (locale, slug)
);

create table public.article_revisions (
  id bigint generated always as identity primary key,
  article_id uuid not null references public.articles(id) on delete cascade,
  version integer not null,
  editor_id uuid references public.profiles(id) on delete set null,
  snapshot jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  unique (article_id, version)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  bucket text not null,
  path text not null,
  mime_type text,
  alt_ru text,
  alt_en text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table public.approval_events (
  id bigint generated always as identity primary key,
  article_id uuid not null references public.articles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  actor_kind text not null check (actor_kind in ('admin', 'telegram', 'system')),
  action text not null,
  from_status public.article_status,
  to_status public.article_status,
  article_version integer not null,
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.approval_tokens (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  article_version integer not null,
  action text not null check (action in ('approve', 'reject', 'regenerate', 'schedule')),
  token_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.publication_jobs (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  channel public.publication_channel not null,
  status public.publication_status not null default 'queued',
  idempotency_key text not null unique,
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  scheduled_at timestamptz,
  locked_at timestamptz,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  job_id uuid references public.publication_jobs(id) on delete set null,
  channel public.publication_channel not null,
  external_id text,
  external_url text,
  published_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  execution_id text,
  status text not null check (status in ('running', 'succeeded', 'failed')),
  input_count integer not null default 0,
  output_count integer not null default 0,
  error text,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index articles_status_idx on public.articles(status, published_at desc);
create index article_localizations_slug_idx on public.article_localizations(locale, slug);
create index publication_jobs_queue_idx on public.publication_jobs(status, scheduled_at);
create index source_items_created_idx on public.source_items(created_at desc);

create or replace function private.current_user_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() and active = true $$;

create or replace function private.is_editor()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(private.current_user_role() in ('owner', 'editor'), false) $$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users for each row execute function private.handle_new_user();

create or replace function public.transition_article(
  target_article_id uuid,
  expected_version integer,
  target_status public.article_status,
  event_note text default null,
  target_scheduled_at timestamptz default null,
  actor_kind text default 'admin'
)
returns public.articles
language plpgsql security invoker set search_path = public, private
as $$
declare
  current_article public.articles;
  updated_article public.articles;
begin
  if not private.is_editor() and auth.role() <> 'service_role' then
    raise exception 'not_authorized';
  end if;

  select * into current_article from public.articles where id = target_article_id for update;
  if not found then raise exception 'article_not_found'; end if;
  if current_article.version <> expected_version then raise exception 'version_conflict'; end if;

  update public.articles
  set status = target_status,
      scheduled_at = coalesce(target_scheduled_at, scheduled_at),
      approved_by = case when target_status = 'approved' then auth.uid() else approved_by end,
      approved_at = case when target_status = 'approved' then now() else approved_at end,
      updated_by = auth.uid(),
      version = version + 1,
      updated_at = now()
  where id = target_article_id
  returning * into updated_article;

  insert into public.approval_events (
    article_id, actor_id, actor_kind, action, from_status, to_status, article_version, note
  ) values (
    target_article_id, auth.uid(), actor_kind, 'transition', current_article.status,
    target_status, updated_article.version, event_note
  );

  if target_status in ('approved', 'scheduled') then
    insert into public.publication_jobs (
      article_id, channel, status, idempotency_key, scheduled_at, payload
    ) values
      (
        target_article_id,
        'site',
        'queued',
        target_article_id::text || ':' || updated_article.version::text || ':site',
        case when target_status = 'scheduled' then target_scheduled_at else now() end,
        jsonb_build_object('articleVersion', updated_article.version)
      ),
      (
        target_article_id,
        'telegram',
        'queued',
        target_article_id::text || ':' || updated_article.version::text || ':telegram',
        case when target_status = 'scheduled' then target_scheduled_at else now() end,
        jsonb_build_object('articleVersion', updated_article.version)
      )
    on conflict (idempotency_key) do nothing;
  end if;

  return updated_article;
end;
$$;

create or replace function public.save_article_localization(
  target_article_id uuid,
  expected_version integer,
  target_locale public.article_locale,
  payload jsonb
)
returns public.articles
language plpgsql security invoker set search_path = public, private
as $$
declare
  current_article public.articles;
  updated_article public.articles;
begin
  if not private.is_editor() and auth.role() <> 'service_role' then
    raise exception 'not_authorized';
  end if;

  select * into current_article from public.articles where id = target_article_id for update;
  if not found then raise exception 'article_not_found'; end if;
  if current_article.version <> expected_version then raise exception 'version_conflict'; end if;

  insert into public.article_localizations (
    article_id, locale, slug, title, summary, body, seo_title,
    seo_description, telegram_text, fact_warnings, translation_status, updated_at
  ) values (
    target_article_id,
    target_locale,
    payload->>'slug',
    payload->>'title',
    payload->>'summary',
    payload->>'body',
    nullif(payload->>'seoTitle', ''),
    nullif(payload->>'seoDescription', ''),
    nullif(payload->>'telegramText', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(payload->'factWarnings', '[]'::jsonb))), '{}'),
    coalesce(nullif(payload->>'translationStatus', ''), 'draft'),
    now()
  )
  on conflict (article_id, locale) do update set
    slug = excluded.slug,
    title = excluded.title,
    summary = excluded.summary,
    body = excluded.body,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    telegram_text = excluded.telegram_text,
    fact_warnings = excluded.fact_warnings,
    translation_status = excluded.translation_status,
    updated_at = now();

  update public.articles set
    category = coalesce(nullif(payload->>'category', ''), category),
    tags = coalesce(array(select jsonb_array_elements_text(coalesce(payload->'tags', '[]'::jsonb))), tags),
    image_url = coalesce(nullif(payload->>'imageUrl', ''), image_url),
    updated_by = auth.uid(),
    version = version + 1,
    updated_at = now()
  where id = target_article_id
  returning * into updated_article;

  insert into public.article_revisions (article_id, version, editor_id, snapshot, note)
  values (target_article_id, updated_article.version, auth.uid(), payload, 'editor_save');

  return updated_article;
end;
$$;

alter table public.profiles enable row level security;
alter table public.sources enable row level security;
alter table public.source_items enable row level security;
alter table public.articles enable row level security;
alter table public.article_localizations enable row level security;
alter table public.article_revisions enable row level security;
alter table public.media_assets enable row level security;
alter table public.approval_events enable row level security;
alter table public.approval_tokens enable row level security;
alter table public.publication_jobs enable row level security;
alter table public.publications enable row level security;
alter table public.workflow_runs enable row level security;

create policy "profiles read own or owner" on public.profiles for select
using (id = auth.uid() or private.current_user_role() = 'owner');
create policy "profiles update own" on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid());

create policy "editors manage sources" on public.sources for all using (private.is_editor()) with check (private.is_editor());
create policy "editors manage source items" on public.source_items for all using (private.is_editor()) with check (private.is_editor());
create policy "editors manage articles" on public.articles for all using (private.is_editor()) with check (private.is_editor());
create policy "public reads published articles" on public.articles for select
using (status = 'published' and archived_at is null);
create policy "editors manage localizations" on public.article_localizations for all using (private.is_editor()) with check (private.is_editor());
create policy "public reads published localizations" on public.article_localizations for select
using (exists (select 1 from public.articles a where a.id = article_id and a.status = 'published' and a.archived_at is null));
create policy "editors manage revisions" on public.article_revisions for all using (private.is_editor()) with check (private.is_editor());
create policy "editors manage media" on public.media_assets for all using (private.is_editor()) with check (private.is_editor());
create policy "editors read approvals" on public.approval_events for select using (private.is_editor());
create policy "editors read approval tokens" on public.approval_tokens for select using (private.is_editor());
create policy "editors manage jobs" on public.publication_jobs for all using (private.is_editor()) with check (private.is_editor());
create policy "editors read publications" on public.publications for select using (private.is_editor());
create policy "editors read runs" on public.workflow_runs for select using (private.is_editor());

insert into storage.buckets (id, name, public)
values ('editorial-drafts', 'editorial-drafts', false), ('editorial-public', 'editorial-public', true)
on conflict (id) do nothing;

create policy "editors upload draft media" on storage.objects for insert to authenticated
with check (bucket_id = 'editorial-drafts' and private.is_editor());
create policy "editors read draft media" on storage.objects for select to authenticated
using (bucket_id = 'editorial-drafts' and private.is_editor());
create policy "editors update draft media" on storage.objects for update to authenticated
using (bucket_id = 'editorial-drafts' and private.is_editor())
with check (bucket_id = 'editorial-drafts' and private.is_editor());
create policy "public reads editorial media" on storage.objects for select
using (bucket_id = 'editorial-public');
create policy "editors manage public media" on storage.objects for all to authenticated
using (bucket_id = 'editorial-public' and private.is_editor())
with check (bucket_id = 'editorial-public' and private.is_editor());

grant usage on schema public to anon, authenticated, service_role;
grant select on public.articles, public.article_localizations, public.source_items to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on function public.transition_article(uuid, integer, public.article_status, text, timestamptz, text) to authenticated, service_role;
grant execute on function public.save_article_localization(uuid, integer, public.article_locale, jsonb) to authenticated, service_role;
revoke execute on function public.transition_article(uuid, integer, public.article_status, text, timestamptz, text) from anon;
revoke execute on function public.save_article_localization(uuid, integer, public.article_locale, jsonb) from anon;
