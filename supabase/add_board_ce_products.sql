-- =============================================================================
-- Board director continuing education: one product per association and seat count
-- =============================================================================
--
-- /board-members-continuing-education sells CE by association type and by how
-- many directors are enrolling:
--
--   Condo (1 hour, Chapter 718)   1 director $14   2 directors $24   3+ $10 each
--   HOA   (4 hours, Chapter 720)  1 director $39   2 directors $74   3+ $33 each
--   Coop  (1 hour, Chapter 719)   1 director $14   (2 and 3+ are "Coming Soon")
--
-- The catalog held a single board CE product at $29, so every Enroll Now would
-- have charged $29. Prices are resolved server-side from courses.price_cents
-- (see priceCart in src/lib/fulfillment.ts), so a variant that exists only in
-- a page's copy cannot be charged.
--
-- The "3 and More Directors" rows are per-seat prices: the visitor picks the
-- quantity in the cart, exactly as the original tells them to ("Select the
-- number at check-out").
--
-- The two Coop rows the original marks "Coming Soon!" are deliberately NOT
-- created — the page renders those as disabled, and a purchasable row would
-- invite selling something that does not exist yet.
--
-- is_listed = false throughout: these belong on the landing page, not as seven
-- near-identical tiles in /courses. The existing board-continuing-education
-- row is left alone and keeps the catalog entry.
--
-- Requires add_course_tiers.sql (adds the is_listed column).
--
-- Safe to re-run. Run in the Supabase SQL editor, then regenerate types:
--   npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz \
--     > src/lib/database.types.ts
-- =============================================================================

insert into public.courses (
  track_id, offering_type, slug, title, subtitle, description,
  hours, price_cents, is_state_approved, passing_exam_score,
  access_days, is_published, is_listed, sort_order
)
select
  c.track_id,
  c.offering_type,
  t.slug,
  t.title,
  t.subtitle,
  c.description,
  t.hours,
  t.price_cents,
  c.is_state_approved,
  c.passing_exam_score,
  c.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('board-ce-condo-1',
   'Condo Board Director Continuing Education (1 Director)',
   'One-hour course on Chapter 718 updates',
   1, 1400, 141),
  ('board-ce-condo-2',
   'Condo Board Director Continuing Education (2 Directors)',
   'One-hour course on Chapter 718 updates',
   1, 2400, 142),
  ('board-ce-condo-3-plus',
   'Condo Board Director Continuing Education (3 and More Directors)',
   'One-hour course on Chapter 718 updates — price per director',
   1, 1000, 143),
  ('board-ce-hoa-1',
   'HOA Board Director Continuing Education (1 Director)',
   'Four-hour course on Chapter 720 updates',
   4, 3900, 144),
  ('board-ce-hoa-2',
   'HOA Board Director Continuing Education (2 Directors)',
   'Four-hour course on Chapter 720 updates',
   4, 7400, 145),
  ('board-ce-hoa-3-plus',
   'HOA Board Director Continuing Education (3 and More Directors)',
   'Four-hour course on Chapter 720 updates — price per director',
   4, 3300, 146),
  ('board-ce-coop-1',
   'Coop Board Director Continuing Education (1 Director)',
   'One-hour course on Chapter 719 updates',
   1, 1400, 147)
) as t(slug, title, subtitle, hours, price_cents, sort_order)
where c.slug = 'board-continuing-education'
on conflict (slug) do update
set title        = excluded.title,
    subtitle     = excluded.subtitle,
    hours        = excluded.hours,
    price_cents  = excluded.price_cents,
    is_published = excluded.is_published,
    is_listed    = excluded.is_listed,
    sort_order   = excluded.sort_order,
    updated_at   = now();

-- ---------------------------------------------------------------------------
-- Check: expect 1400 / 2400 / 1000 / 3900 / 7400 / 3300 / 1400.
-- ---------------------------------------------------------------------------
select slug, title, hours, price_cents, is_listed
  from public.courses
 where slug like 'board-ce-%'
 order by sort_order;
