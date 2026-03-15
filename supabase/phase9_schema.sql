-- Phase 9 schema additions (Admin Profile + Integrations)

create table if not exists admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
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
  user_id uuid not null,
  provider text not null,
  status text not null default 'disconnected',
  external_user_id text,
  connected_at timestamptz,
  last_checked_at timestamptz,
  secret_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

alter table admin_profiles enable row level security;
alter table admin_integrations enable row level security;

create policy "Admin manage profiles" on admin_profiles
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

create policy "Admin manage integrations" on admin_integrations
  for all
  using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Optional: foreign keys (enable if you maintain a users mirror table)
-- alter table admin_profiles add constraint admin_profiles_user_fk foreign key (user_id) references auth.users(id);
-- alter table admin_integrations add constraint admin_integrations_user_fk foreign key (user_id) references auth.users(id);
