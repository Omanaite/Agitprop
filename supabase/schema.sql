-- Schema for tattoo portfolio data.
create table if not exists tattoos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  style text not null,
  image_url text not null,
  gallery_id uuid,
  tags text[],
  location_link text,
  session_length_minutes int,
  aftercare text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  preferred_date date not null,
  placement text not null,
  description text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  excerpt text,
  cover_image_url text,
  status text not null default 'draft',
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  eyebrow text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  nickname text,
  shipping_address text,
  billing_address text,
  payment_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  status text not null default 'disconnected',
  external_user_id text,
  connected_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists admin_payment_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  mode text not null default 'test',
  stripe_account_id text,
  stripe_public_reference text,
  paypal_merchant_email text,
  paypal_merchant_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tattoos
  add constraint tattoos_gallery_fk
  foreign key (gallery_id) references galleries(id)
  on delete set null;

-- Enable RLS for public safety.
alter table tattoos enable row level security;
alter table bookings enable row level security;
alter table posts enable row level security;
alter table galleries enable row level security;
alter table audit_logs enable row level security;
alter table homepage_sections enable row level security;
alter table admin_profiles enable row level security;
alter table admin_integrations enable row level security;
alter table admin_payment_settings enable row level security;

-- Public read access for tattoos.
create policy "Public read tattoos" on tattoos
  for select using (true);

create policy "Public read posts" on posts
  for select using (status = 'published');

create policy "Public read galleries" on galleries
  for select using (true);

create policy "Public read homepage sections" on homepage_sections
  for select using (true);

-- Booking inserts via server only (service role key).
create policy "Service role insert bookings" on bookings
  for insert to authenticated
  with check (true);

-- Admin access (custom claim role=admin).
create policy "Admin manage tattoos" on tattoos
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admin manage posts" on posts
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admin manage galleries" on galleries
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admin manage audit logs" on audit_logs
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admin manage homepage sections" on homepage_sections
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_profiles'
      and policyname = 'Admin manage admin profiles'
  ) then
    create policy "Admin manage admin profiles" on admin_profiles
      for all
      using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
      with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_integrations'
      and policyname = 'Admin manage admin integrations'
  ) then
    create policy "Admin manage admin integrations" on admin_integrations
      for all
      using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
      with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_payment_settings'
      and policyname = 'Admin manage admin payment settings'
  ) then
    create policy "Admin manage admin payment settings" on admin_payment_settings
      for all
      using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
      with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
  end if;
end $$;

insert into homepage_sections (section_key, title, eyebrow, sort_order, is_visible)
values
  ('hero', 'Anatomy, Anarchy, Ink.', 'Brutalist Digital Zine', 0, true),
  ('work', 'Selected Work', 'Gallery', 1, true),
  ('galleries', 'Curated Galleries', 'Collections', 2, true),
  ('about', 'Artist Statement', 'About', 3, true),
  ('booking', 'Booking Protocol', 'Session', 4, true),
  ('rates', 'Rates & Payments', 'Pricing', 5, true),
  ('contact', 'Direct Contact', 'Signal', 6, true),
  ('posts', 'Studio Notes', 'Posts', 7, true)
on conflict (section_key) do nothing;

-- Storage bucket for gallery images (public read).
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "Public read gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Admin manage gallery images"
  on storage.objects for all
  using (bucket_id = 'gallery' and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (bucket_id = 'gallery' and auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
