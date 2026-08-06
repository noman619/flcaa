-- =============================================================================
-- Board member certification: the single-seat price and the two multi-seat SKUs
-- =============================================================================
--
-- The original sells the 4-hour newly-elected board director certification by
-- seat count:
--   One (1) Board Member      $49
--   Two (2) Board Members     $78
--   Up to 6 Board Members     $97
--
-- The catalog held one product at $39, so the landing page's three Enroll
-- buttons would all have charged $39. Prices are resolved server-side from
-- courses.price_cents (see priceCart in src/lib/fulfillment.ts), so a seat
-- count that exists only in a page's copy cannot be charged.
--
-- These are NOT part of the "Back to School" promotion and carry no struck
-- anchor — $49/$78/$97 are simply the prices.
--
-- is_listed = false on the multi-seat rows: they belong on the landing page,
-- not as extra tiles in /courses, exactly as the licensing tiers do.
--
-- Requires add_course_tiers.sql (adds the is_listed column).
--
-- Safe to re-run. Run in the Supabase SQL editor, then regenerate types:
--   npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz \
--     > src/lib/database.types.ts
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. The single-seat course, priced and named as the store shows it.
-- ---------------------------------------------------------------------------
-- The title is what the cart, order and receipt show, so it has to read the
-- way the original's cart line does: "Florida Board Member Certification
-- (Solo)". The seat count belongs in the name — a cart holding two board
-- member products that differ only in price is unreadable.

update public.courses
   set title       = 'Florida Board Member Certification (Solo)',
       subtitle    = 'One (1) Board Member',
       price_cents = 4900,
       updated_at  = now()
 where slug = 'board-director-certification';

-- ---------------------------------------------------------------------------
-- 2. The two multi-seat products.
-- ---------------------------------------------------------------------------
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
  c.hours,
  t.price_cents,
  c.is_state_approved,
  c.passing_exam_score,
  c.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('board-director-certification-2',
   'Florida Board Member Certification (2 Members)',
   'Two (2) Board Members',
   7800,
   131),
  ('board-director-certification-6',
   'Florida Board Member Certification (up to 6 Members)',
   'Up to 6 Board Members',
   9700,
   132)
) as t(slug, title, subtitle, price_cents, sort_order)
where c.slug = 'board-director-certification'
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
-- Check: expect 4900 / 7800 / 9700.
-- ---------------------------------------------------------------------------
select slug, title, hours, price_cents, is_listed
  from public.courses
 where slug like 'board-director-certification%'
 order by sort_order;
