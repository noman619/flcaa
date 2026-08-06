-- =============================================================================
-- Broker post-licensing: the two courses the shelf actually sells
-- =============================================================================
--
-- The 60-hour broker post-licensing requirement is met by two 30-credit
-- courses, sold separately at $89 each:
--
--   Essentials of Real Estate Investment v1.0        $89
--   Real Estate Brokerage: A Management Guide v1.0   $89
--
-- The catalog held one 60-hour product at $179, so both Add to Cart buttons
-- on /real-estate-broker-post-licensing would have charged $179. Prices are
-- resolved server-side from courses.price_cents (see priceCart in
-- src/lib/fulfillment.ts), so a course that exists only in a page's copy
-- cannot be charged.
--
-- The $179 parent row is deliberately left alone and stays listed: it is the
-- catalog's entry for the requirement as a whole, and "View Details" on both
-- rows points at it.
--
-- is_listed = false on the two new rows: they belong on the shelf, not as
-- extra tiles in /courses.
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
  30,
  8900,
  c.is_state_approved,
  c.passing_exam_score,
  c.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('re-60-broker-post-investment',
   'Essentials of Real Estate Investment v1.0',
   'Feel Confident Making the Leap into Real Estate Investment with This Course',
   171),
  ('re-60-broker-post-brokerage',
   'Real Estate Brokerage: A Management Guide v1.0',
   'Develop your leadership skills with this management guide.',
   172)
) as t(slug, title, subtitle, sort_order)
where c.slug = 're-60-broker-post'
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
-- Check: expect the parent at 17900 and two courses at 8900.
-- ---------------------------------------------------------------------------
select slug, title, hours, price_cents, is_listed
  from public.courses
 where slug like 're-60-broker-post%'
 order by sort_order;
