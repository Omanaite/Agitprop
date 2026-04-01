-- ARTIST_SITE_THEMES_PATCH.sql
-- Adds tenant theme/domain support and idempotent safety guards.

alter table if exists public.artist_tenants
  add column if not exists site_theme text not null default 'atelier';

alter table if exists public.artist_tenants
  add column if not exists custom_domain text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'artist_tenants_site_theme_chk'
  ) then
    alter table public.artist_tenants
      add constraint artist_tenants_site_theme_chk
      check (site_theme in ('atelier', 'mono', 'ink', 'akemi_brutalist'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tattoos_gallery_fk'
  ) then
    alter table public.tattoos
      add constraint tattoos_gallery_fk
      foreign key (gallery_id) references public.galleries(id)
      on delete set null;
  end if;
end $$;
