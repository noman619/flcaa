-- =============================================================================
-- Pricing tiers for the 16-Hour CAM Licensing course
-- =============================================================================
--
-- Same shape as add_course_tiers.sql, which did this for the 63-hour real
-- estate course. /florida-cam-license-course-online sells Basic / Premium /
-- Ultimate, but the catalog has a single CAM product, so all three Enroll
-- buttons would charge the same price. Prices are resolved server-side from
-- courses.price_cents (see priceCart in src/lib/fulfillment.ts), so a tier that
-- exists only in the page's copy cannot be charged correctly.
--
-- Requires add_course_tiers.sql to have been run first — that is where the
-- is_listed column is added.
--
-- price_cents holds the LIST price, not the discounted one — the same rule
-- set_list_prices_for_promo.sql established for the real estate tiers. The
-- "30% OFF August Deal" is applied server-side in priceCart (src/lib/promo.ts),
-- so a row storing the post-discount figure has nothing left to take off and
-- the cart shows no discount line at all:
--
--   list 26000  ->  26000 - 30%  =  18200  ($182.00)   Basic,    was $260
--   list 33200  ->  33200 - 30%  =  23240  ($232.40)   Premium,  was $332
--   list 42600  ->  42600 - 30%  =  29820  ($298.20)   Ultimate, was $426
--
-- All three land exactly on the advertised price, so no PROMO.finalCents
-- override is needed. These slugs ARE listed in PROMO.slugs.
--
-- Access length follows the feature matrix: 6 months for Basic and Premium,
-- plus the 3-month extension for Ultimate.
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
  c.hours,
  t.price_cents,
  c.is_state_approved,
  c.passing_exam_score,
  t.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('cam-licensing-course-basic',
   '16-Hour CAM Licensing Course — Basic',
   'State-approved 16-hour course, fully narrated.',
   26000, 180, 111),
  ('cam-licensing-course-premium',
   '16-Hour CAM Licensing Course — Premium',
   'Adds the state exam simulator and digital flashcards.',
   33200, 180, 112),
  ('cam-licensing-course-ultimate',
   '16-Hour CAM Licensing Course — Ultimate',
   'Adds unlimited end-of-course exam retakes and a 3-month extension.',
   42600, 270, 113)
) as t(slug, title, subtitle, price_cents, access_days, sort_order)
where c.slug = 'cam-licensing-course'
on conflict (slug) do update
set title        = excluded.title,
    subtitle     = excluded.subtitle,
    price_cents  = excluded.price_cents,
    access_days  = excluded.access_days,
    is_published = excluded.is_published,
    is_listed    = excluded.is_listed,
    sort_order   = excluded.sort_order,
    updated_at   = now();

-- ---------------------------------------------------------------------------
-- The base product, on the same footing
-- ---------------------------------------------------------------------------
-- /courses/cam-licensing-course sells the same thing at the Basic price, and
-- it is the fallback the landing page uses when a tier row is missing. It must
-- therefore also hold the LIST price, exactly as re-63-sales-associate does.

update public.courses
set price_cents = 26000, updated_at = now()
where slug = 'cam-licensing-course';

-- ---------------------------------------------------------------------------
-- Check: list price, and what the visitor will actually pay
-- ---------------------------------------------------------------------------
-- Expect payable_cents of 18200 / 23240 / 29820 on the three tiers.
select
  slug,
  price_cents                              as list_cents,
  round(price_cents * 0.30)                as promo_discount_cents,
  price_cents - round(price_cents * 0.30)  as payable_cents,
  access_days,
  is_published,
  is_listed
from public.courses
where slug like 'cam-licensing-course%'
order by sort_order;
