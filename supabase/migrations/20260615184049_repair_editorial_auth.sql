-- Repair the auth layer when the initial editorial migration was only
-- partially executed in the Supabase SQL editor.

create schema if not exists private;

create or replace function private.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid() and active = true
$$;

create or replace function private.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select coalesce(private.current_user_role() in ('owner', 'editor'), false)
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

-- Backfill users created before the trigger existed. Existing roles are kept.
insert into public.profiles (id, email, display_name)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data->>'display_name', split_part(coalesce(email, ''), '@', 1))
from auth.users
on conflict (id) do update set
  email = excluded.email,
  display_name = coalesce(public.profiles.display_name, excluded.display_name),
  updated_at = now();

alter table public.profiles enable row level security;

drop policy if exists "profiles read own" on public.profiles;
drop policy if exists "profiles read owner" on public.profiles;
drop policy if exists "profiles read own or owner" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;

-- Keep the own-row rule separate so login never depends on the role helper.
create policy "profiles read own"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "profiles read owner"
on public.profiles for select
to authenticated
using (private.current_user_role() = 'owner');

create policy "profiles update own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant usage on schema private to authenticated, service_role;
grant execute on function private.current_user_role() to authenticated, service_role;
grant execute on function private.is_editor() to authenticated, service_role;
grant execute on function private.handle_new_user() to service_role;
grant select, update on public.profiles to authenticated;
