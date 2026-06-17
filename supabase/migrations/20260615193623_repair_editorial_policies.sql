-- Complete RLS for the editorial tables that already exist in projects where
-- the initial SQL file stopped before policy creation.

alter table public.sources enable row level security;
alter table public.source_items enable row level security;
alter table public.articles enable row level security;
alter table public.article_localizations enable row level security;

drop policy if exists "editors manage sources" on public.sources;
create policy "editors manage sources"
on public.sources for all
to authenticated
using (private.is_editor())
with check (private.is_editor());

drop policy if exists "editors manage source items" on public.source_items;
create policy "editors manage source items"
on public.source_items for all
to authenticated
using (private.is_editor())
with check (private.is_editor());

drop policy if exists "editors manage articles" on public.articles;
create policy "editors manage articles"
on public.articles for all
to authenticated
using (private.is_editor())
with check (private.is_editor());

drop policy if exists "public reads published articles" on public.articles;
create policy "public reads published articles"
on public.articles for select
to anon, authenticated
using (status = 'published' and archived_at is null);

drop policy if exists "editors manage localizations" on public.article_localizations;
create policy "editors manage localizations"
on public.article_localizations for all
to authenticated
using (private.is_editor())
with check (private.is_editor());

drop policy if exists "public reads published localizations" on public.article_localizations;
create policy "public reads published localizations"
on public.article_localizations for select
to anon, authenticated
using (
  exists (
    select 1
    from public.articles article
    where article.id = article_id
      and article.status = 'published'
      and article.archived_at is null
  )
);

grant select on public.articles, public.article_localizations, public.source_items to anon;
grant select, insert, update, delete on
  public.sources,
  public.source_items,
  public.articles,
  public.article_localizations
to authenticated;
