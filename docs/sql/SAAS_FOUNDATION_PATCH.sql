-- Agitprop SaaS Foundation Patch (idempotent)
-- Run this in Supabase SQL Editor when promoting platform-admin + tenancy modules.

begin;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tattoos_gallery_fk'
      and conrelid = 'public.tattoos'::regclass
  ) then
    alter table public.tattoos
      add constraint tattoos_gallery_fk
      foreign key (gallery_id) references public.galleries(id)
      on delete set null;
  end if;
end $$;

create table if not exists public.artist_tenants (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique references auth.users(id) on delete cascade,
  studio_name text not null,
  slug text not null unique,
  status text not null default 'active',
  plan_code text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.artist_tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'artist_admin',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table if not exists public.platform_integrations (
  provider text primary key,
  is_enabled boolean not null default true,
  maintenance_message text,
  updated_at timestamptz not null default now()
);

alter table public.artist_tenants enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.platform_integrations enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'artist_tenants'
      and policyname = 'Admin manage artist tenants'
  ) then
    create policy "Admin manage artist tenants" on public.artist_tenants
      for all
      using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
      with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'tenant_memberships'
      and policyname = 'Admin manage tenant memberships'
  ) then
    create policy "Admin manage tenant memberships" on public.tenant_memberships
      for all
      using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
      with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'platform_integrations'
      and policyname = 'Admin manage platform integrations'
  ) then
    create policy "Admin manage platform integrations" on public.platform_integrations
      for all
      using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
      with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  end if;
end $$;

insert into public.platform_integrations (provider, is_enabled, maintenance_message)
values
  ('supabase_storage', true, null),
  ('google_oauth', true, null),
  ('github_oauth', true, null)
on conflict (provider) do nothing;

commit;

