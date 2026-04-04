-- MVP Completion Patch (idempotent)
-- Run in Supabase SQL editor AFTER STUDIO_TENANT_OWNERSHIP_PATCH.sql

-- 1. Rates config per artist (array of rate cards as JSONB)
alter table public.artist_tenants
  add column if not exists rates jsonb default '[]'::jsonb;

-- 2. Availability config per artist
-- Format: { mon: bool, tue: bool, wed: bool, thu: bool, fri: bool, sat: bool, sun: bool,
--           start_time: "10:00", end_time: "18:00", notes: string }
alter table public.artist_tenants
  add column if not exists availability jsonb default '{}'::jsonb;
