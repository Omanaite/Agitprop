-- Seed data for Akemi Tattoo Portfolio
-- Safe to run multiple times (uses upsert / conflict handling).

-- Galleries
insert into galleries (id, title, description, slug)
values
  (gen_random_uuid(), 'Blackwork Rituals', 'High-contrast ceremonial pieces.', 'blackwork-rituals'),
  (gen_random_uuid(), 'Fine Line Studies', 'Precision linework and delicate studies.', 'fine-line-studies')
on conflict (slug) do nothing;

-- Tattoos (gallery_id resolved by slug)
insert into tattoos (
  id,
  title,
  description,
  style,
  image_url,
  gallery_id,
  tags,
  location_link,
  session_length_minutes,
  aftercare,
  sort_order
)
values
  (
    gen_random_uuid(),
    'Crown of Thorns',
    'Dense blackwork with stippled highlights.',
    'blackwork',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    (select id from galleries where slug = 'blackwork-rituals'),
    array['blackwork','contrast'],
    null,
    210,
    'Keep covered for 24h. Clean twice daily.',
    1
  ),
  (
    gen_random_uuid(),
    'Bone Oracle',
    'Anatomic study with negative space.',
    'blackwork',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    (select id from galleries where slug = 'blackwork-rituals'),
    array['anatomy','ritual'],
    null,
    180,
    'Avoid soaking for 7 days.',
    2
  ),
  (
    gen_random_uuid(),
    'Threaded Line',
    'Minimal linework with soft shading.',
    'fine-line',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    (select id from galleries where slug = 'fine-line-studies'),
    array['fine-line','minimal'],
    null,
    120,
    'Moisturize lightly after 48h.',
    1
  )
on conflict do nothing;

-- Posts
insert into posts (
  id,
  title,
  body,
  excerpt,
  cover_image_url,
  status,
  publish_at
)
values
  (
    gen_random_uuid(),
    'Studio Notes: March',
    'New flash sheets are live. Booking slots open next week.',
    'New flash sheets are live.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'published',
    now() - interval '1 day'
  ),
  (
    gen_random_uuid(),
    'Process: Blackwork Rituals',
    'A breakdown of the ritual process, from sketch to stencil.',
    'A breakdown of the ritual process.',
    null,
    'draft',
    null
  )
on conflict do nothing;

-- Bookings
insert into bookings (
  id,
  name,
  email,
  preferred_date,
  placement,
  description,
  status
)
values
  (
    gen_random_uuid(),
    'Sofia Mendoza',
    'sofia@example.com',
    current_date + 30,
    'Forearm',
    'Looking for a blackwork talisman piece.',
    'pending'
  ),
  (
    gen_random_uuid(),
    'Diego Cruz',
    'diego@example.com',
    current_date + 45,
    'Calf',
    'Fine line botanical with minimal shading.',
    'pending'
  )
on conflict do nothing;

-- Audit logs (admin actions)
insert into audit_logs (
  id,
  actor_email,
  action,
  entity,
  entity_id,
  metadata
)
values
  (
    gen_random_uuid(),
    'admin@example.com',
    'seed',
    'galleries',
    (select id from galleries where slug = 'blackwork-rituals'),
    '{"source":"seed"}'::jsonb
  ),
  (
    gen_random_uuid(),
    'admin@example.com',
    'seed',
    'posts',
    (select id from posts where title = 'Studio Notes: March'),
    '{"source":"seed"}'::jsonb
  )
on conflict do nothing;

-- Pending seed sections (not yet implemented in product):
-- - OAuth identities table
-- - Admin profile (billing/shipping/nickname)
-- - Cloud storage connections
-- - Payment transactions
