create table if not exists public.editorial_drafts (
  id uuid primary key default gen_random_uuid(),
  external_id text not null,
  source_url text,
  canonical_url text,
  source_name text not null default 'AI News Radar',
  source_author text,
  slug text,
  title text not null,
  summary text not null,
  body text not null,
  seo_title text,
  seo_description text,
  telegram_text text,
  category text not null default 'ai',
  tags text[] not null default '{}',
  fact_warnings text[] not null default '{}',
  image_url text,
  status text not null default 'draft',
  published_at timestamptz,
  raw_source jsonb not null default '{}'::jsonb,
  raw_opinion jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.editorial_drafts add column if not exists external_id text;
alter table public.editorial_drafts add column if not exists source_url text;
alter table public.editorial_drafts add column if not exists canonical_url text;
alter table public.editorial_drafts add column if not exists source_name text not null default 'AI News Radar';
alter table public.editorial_drafts add column if not exists source_author text;
alter table public.editorial_drafts add column if not exists slug text;
alter table public.editorial_drafts add column if not exists title text;
alter table public.editorial_drafts add column if not exists summary text;
alter table public.editorial_drafts add column if not exists body text;
alter table public.editorial_drafts add column if not exists seo_title text;
alter table public.editorial_drafts add column if not exists seo_description text;
alter table public.editorial_drafts add column if not exists telegram_text text;
alter table public.editorial_drafts add column if not exists category text not null default 'ai';
alter table public.editorial_drafts add column if not exists tags text[] not null default '{}';
alter table public.editorial_drafts add column if not exists fact_warnings text[] not null default '{}';
alter table public.editorial_drafts add column if not exists image_url text;
alter table public.editorial_drafts add column if not exists status text not null default 'draft';
alter table public.editorial_drafts add column if not exists published_at timestamptz;
alter table public.editorial_drafts add column if not exists raw_source jsonb not null default '{}'::jsonb;
alter table public.editorial_drafts add column if not exists raw_opinion jsonb not null default '{}'::jsonb;
alter table public.editorial_drafts add column if not exists version integer not null default 1 check (version > 0);
alter table public.editorial_drafts add column if not exists created_at timestamptz not null default now();
alter table public.editorial_drafts add column if not exists updated_at timestamptz not null default now();

alter table public.editorial_drafts
  drop constraint if exists editorial_drafts_status_check;

alter table public.editorial_drafts
  add constraint editorial_drafts_status_check
  check (status in (
    'ingested', 'processing', 'draft', 'pending_approval', 'approved',
    'scheduled', 'publishing', 'published', 'rejected', 'failed'
  ));

create unique index if not exists editorial_drafts_external_id_idx
on public.editorial_drafts(external_id)
where external_id is not null;

create unique index if not exists editorial_drafts_slug_idx
on public.editorial_drafts(slug)
where slug is not null;

create index if not exists editorial_drafts_status_updated_idx
on public.editorial_drafts(status, updated_at desc);

create or replace function public.touch_editorial_drafts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists editorial_drafts_touch_updated_at on public.editorial_drafts;
create trigger editorial_drafts_touch_updated_at
before update on public.editorial_drafts
for each row execute function public.touch_editorial_drafts_updated_at();

alter table public.editorial_drafts enable row level security;

drop policy if exists "editors manage editorial drafts" on public.editorial_drafts;
create policy "editors manage editorial drafts"
on public.editorial_drafts for all
using (private.is_editor())
with check (private.is_editor());

drop policy if exists "public reads published editorial drafts" on public.editorial_drafts;
create policy "public reads published editorial drafts"
on public.editorial_drafts for select
using (status = 'published');

grant select on public.editorial_drafts to anon;
grant select, insert, update, delete on public.editorial_drafts to authenticated;
grant all on public.editorial_drafts to service_role;
