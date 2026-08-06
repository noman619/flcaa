-- =============================================================================
-- The five individual CAM continuing-education courses
-- =============================================================================
--
-- The CE storefront sells the 2026 renewal bundle at $99 AND each 3-hour topic
-- on its own at $25. Only the bundle exists in the catalog, so every "Buy Now"
-- on the store page would have to charge the bundle price or link off-site.
--
-- Prices are resolved server-side from courses.price_cents (see priceCart in
-- src/lib/fulfillment.ts), so a product that exists only in a page's copy
-- cannot be charged at all.
--
-- These are NOT part of the "Back to School" promotion and carry no struck
-- anchor: $25 is simply the price. Only the bundle has a $142 -> $99 anchor,
-- and that lives in LIST_PRICES (src/lib/promo.ts).
--
-- is_listed = false: they belong on the CE store page, not in the main catalog
-- grid, exactly as the licensing tiers do.
--
-- Requires add_course_tiers.sql (adds the is_listed column) and
-- update_cam_ce_course.sql (prices the bundle at 9900).
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
  3,
  2500,
  c.is_state_approved,
  c.passing_exam_score,
  c.access_days,
  true,
  false,
  t.sort_order
from public.courses c
cross join (values
  ('cam-ce-legal-updates-2026',
   'CAM Legal Updates – Renewal 2026',
   'CAM Legal Updates (3 Hrs)',
   121),
  ('cam-ce-problems-conflicts',
   'Dealing with Problems and Conflicts',
   'Human Resources (3 Hrs)',
   122),
  ('cam-ce-collect-dues',
   'Proactive Strategies to Collect Owners’ Dues on Time',
   'Insurance & Fin. Mgt (3 Hrs)',
   123),
  ('cam-ce-preventive-maintenance',
   'Preventive Property Maintenance for CAM',
   'Operation of Property (3 Hrs)',
   124),
  ('cam-ce-prevent-theft-fraud',
   'Prevent Theft and Fraud',
   'Elective (3 Hrs)',
   125)
) as t(slug, title, subtitle, sort_order)
where c.slug = 'cam-continuing-education'
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
-- Check: expect the bundle at 9900 and five topics at 2500.
-- ---------------------------------------------------------------------------
select slug, title, hours, price_cents, is_listed
  from public.courses
 where slug = 'cam-continuing-education'
    or slug like 'cam-ce-%'
 order by sort_order;
