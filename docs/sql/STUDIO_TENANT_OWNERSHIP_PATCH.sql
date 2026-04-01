-- Studio ownership isolation patch (idempotent)
-- Run in Supabase SQL editor (production + preview) before enabling strict tenant/user isolation in /api/studio/*

alter table if exists public.galleries
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

alter table if exists public.tattoos
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

alter table if exists public.posts
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

alter table if exists public.homepage_sections
  add column if not exists owner_user_id uuid references auth.users(id) on delete cascade;

create index if not exists galleries_owner_user_id_idx
  on public.galleries(owner_user_id);

create index if not exists tattoos_owner_user_id_idx
  on public.tattoos(owner_user_id);

create index if not exists posts_owner_user_id_idx
  on public.posts(owner_user_id);

create index if not exists homepage_sections_owner_user_id_idx
  on public.homepage_sections(owner_user_id);

-- Replace global uniqueness with owner-scoped uniqueness for homepage sections.
drop index if exists public.homepage_sections_section_key_key;

create unique index if not exists homepage_sections_owner_section_key_uidx
  on public.homepage_sections(owner_user_id, section_key);

-- Optional: backfill ownership for current pilot admin users.
-- update public.galleries set owner_user_id = '<USER_UUID>' where owner_user_id is null;
-- update public.tattoos set owner_user_id = '<USER_UUID>' where owner_user_id is null;
-- update public.posts set owner_user_id = '<USER_UUID>' where owner_user_id is null;
-- update public.homepage_sections set owner_user_id = '<USER_UUID>' where owner_user_id is null;
