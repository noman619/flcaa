-- =============================================================================
-- The four individual real estate continuing-education courses
-- =============================================================================
--
-- The RE CE storefront sells the 14-hour bundle at $24 AND each topic on its
-- own at $11:
--
--   Business Ethics (3 Hrs)      $11
--   Specialty Credit (4 Hrs)     $11   -- Working With Investors
--   Specialty Credit (4 Hrs)     $11   -- Understanding Mortgages
--   Florida Core Law (3 Hrs)     $11
--
-- Only the bundle exists in the catalog, so every "Buy Now" on the store page
-- would have to charge the bundle price. Prices are resolved server-side from
-- courses.price_cents (see priceCart in src/lib/fulfillment.ts), so a product
-- that exists only in a page's copy cannot be charged at all.
--
-- The store lists the two specialty courses under the same display name; the
-- slugs and titles here keep them apart, since a cart holding two identical
-- lines at $11 is unreadable.
--
-- These carry no struck anchor: $11 is simply the price. Only the bundle has a
-- $35 -> $24 anchor, and that lives in LIST_PRICES (src/lib/promo.ts).
--
-- is_listed = false: they belong on the CE store page, not in the main catalog
-- grid, exactly as the licensing tiers do.
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
  1100,
  c.is_state_approved,
  c.passing_exam_score,
  c.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('re-ce-business-ethics',
   'Ethics For Real Estate Professionals',
   'Business Ethics (3 Hrs)',
   3, 161),
  ('re-ce-investors',
   'Working With Investors',
   'Specialty Credit (4 Hrs)',
   4, 162),
  ('re-ce-mortgages',
   'Understanding Mortgages',
   'Specialty Credit (4 Hrs)',
   4, 163),
  ('re-ce-core-law',
   'Real Estate Legal Updates',
   'Florida Core Law (3 Hrs)',
   3, 164)
) as t(slug, title, subtitle, hours, sort_order)
where c.slug = 're-continuing-education'
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
-- Check: expect the bundle at 2400 and four topics at 1100.
-- ---------------------------------------------------------------------------
select slug, title, subtitle, hours, price_cents, is_listed
  from public.courses
 where slug = 're-continuing-education'
    or slug like 're-ce-%'
 order by sort_order;
