-- Schema for tattoo portfolio data.
create table if not exists tattoos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  style text not null,
  image_url text not null,
  gallery_id uuid,
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
  status text not null default 'draft',
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

alter table tattoos
  add constraint tattoos_gallery_fk
  foreign key (gallery_id) references galleries(id)
  on delete set null;

-- Enable RLS for public safety.
alter table tattoos enable row level security;
alter table bookings enable row level security;
alter table posts enable row level security;
alter table galleries enable row level security;

-- Public read access for tattoos.
create policy "Public read tattoos" on tattoos
  for select using (true);

create policy "Public read posts" on posts
  for select using (status = 'published');

create policy "Public read galleries" on galleries
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
