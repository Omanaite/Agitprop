-- Schema for tattoo portfolio data.
create table if not exists tattoos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  style text not null,
  image_url text not null,
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

-- Enable RLS for public safety.
alter table tattoos enable row level security;
alter table bookings enable row level security;

-- Public read access for tattoos.
create policy "Public read tattoos" on tattoos
  for select using (true);

-- Booking inserts via server only (service role key).
create policy "Service role insert bookings" on bookings
  for insert to authenticated
  with check (true);
