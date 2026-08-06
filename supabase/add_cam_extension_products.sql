-- =============================================================================
-- CAM pre-licensing: course extensions and the re-enrollment
-- =============================================================================
--
-- /get-course-extension-retake sells three things for the CAM pre-licensing
-- course:
--
--   30-day course extension    $52
--   90-day course extension    $89
--   Re-enroll and restart      $132
--
-- The catalog held a single cam-course-extension row at $39, so all three
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
-- inherits the parent course's own access length.
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
   set title       = 'CAM Pre-Licensing – 30-Day Course Extension',
       subtitle    = 'Get 30-day Course Extension',
       price_cents = 5200,
       access_days = 30,
       updated_at  = now()
 where slug = 'cam-course-extension';

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
  ('cam-course-extension-90',
   'CAM Pre-Licensing – 90-Day Course Extension',
   'Get 90-day Course Extension',
   8900, 90, 151),
  ('cam-course-reenroll',
   'CAM Pre-Licensing – Re-enroll and Restart Course',
   'Re-enroll and Restart Course',
   13200, 180, 152)
) as t(slug, title, subtitle, price_cents, access_days, sort_order)
where c.slug = 'cam-course-extension'
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
-- Check: expect 5200 / 8900 / 13200.
-- ---------------------------------------------------------------------------
select slug, title, price_cents, access_days, is_listed
  from public.courses
 where slug in (
   'cam-course-extension', 'cam-course-extension-90', 'cam-course-reenroll'
 )
 order by sort_order;
