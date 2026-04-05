-- TATTOO_LOCATION_NAME_PATCH
-- Adds location_name column to tattoos so artists can label the location
-- instead of showing a raw URL in the piece detail modal.
--
-- Apply in Supabase SQL Editor.

ALTER TABLE tattoos ADD COLUMN IF NOT EXISTS location_name text;
