-- BOOKINGS_TENANT_ISOLATION_PATCH.sql
-- Adds owner_user_id to bookings for per-artist isolation.
-- Idempotent: safe to run multiple times.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'bookings' and column_name = 'owner_user_id'
  ) then
    alter table bookings add column owner_user_id uuid references auth.users(id) on delete set null;
  end if;
end $$;

-- Index for fast per-artist lookups
create index if not exists bookings_owner_user_id_idx on bookings(owner_user_id);
