-- =============================================================================
-- Sales associate licensing: course extensions and the re-enrollment
-- =============================================================================
--
-- /real-estate-courses-extension sells three things for the sales associate
-- pre-licensing course:
--
--   30-day extension       $42
--   90-day extension       $79
--   Re-enroll and restart  $111
--
-- The catalog held a single re-course-extension row at $39, so all three
-- ADD TO CART buttons would have charged $39. Prices are resolved server-side
-- from courses.price_cents (see priceCart in src/lib/fulfillment.ts), so a
-- product that exists only in a page's copy cannot be charged.
--
-- The 30-day extension takes over the existing row — it is the cheapest of the
-- three and the one the catalog tile should keep pointing at. The other two
-- are new and unlisted: they belong on the landing page, not as extra tiles
-- in /courses.
--
-- access_days is what each product actually grants, so an extension bought
-- here extends by the number of days its name promises. The re-enrollment
-- gets the course's usual 6 months.
--
-- Mirrors supabase/add_cam_extension_products.sql for the CAM track.
--
-- Requires add_course_tiers.sql (adds the is_listed column).
--
-- Safe to re-run. Run in the Supabase SQL editor, then regenerate types:
--   npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz \
--     > src/lib/database.types.ts
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. The 30-day extension, priced and named as the page advertises.
-- ---------------------------------------------------------------------------
update public.courses
   set title       = 'Sales Associate Licensing – 30-Day Course Extension',
       subtitle    = 'Get 30-day Extension',
       price_cents = 4200,
       access_days = 30,
       updated_at  = now()
 where slug = 're-course-extension';

-- ---------------------------------------------------------------------------
-- 2. The 90-day extension and the re-enrollment.
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
  t.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('re-course-extension-90',
   'Sales Associate Licensing – 90-Day Course Extension',
   'Get 90-day Extension',
   7900, 90, 181),
  ('re-course-reenroll',
   'Sales Associate Licensing – Re-enroll and Restart Course',
   'Re-enroll and Restart Course',
   11100, 180, 182)
) as t(slug, title, subtitle, price_cents, access_days, sort_order)
where c.slug = 're-course-extension'
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
-- Check: expect 4200 / 7900 / 11100.
-- ---------------------------------------------------------------------------
select slug, title, price_cents, access_days, is_listed
  from public.courses
 where slug in (
   're-course-extension', 're-course-extension-90', 're-course-reenroll'
 )
 order by sort_order;
