-- =============================================================================
-- Pricing tiers for the 63-Hour Sales Associate course
-- =============================================================================
--
-- The marketing page sells Basic / Premium / Ultimate, but the catalog had a
-- single product, so all three Enroll buttons charged the same price. This adds
-- them as real products, because prices are resolved server-side from
-- courses.price_cents (see priceCart in src/lib/fulfillment.ts) — a tier that
-- only exists in the page's copy cannot be charged correctly.
--
-- Safe to run more than once: the column add is IF NOT EXISTS and the inserts
-- are ON CONFLICT (slug) DO UPDATE.
--
-- Run in the Supabase SQL editor, then regenerate types:
--   npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz \
--     > src/lib/database.types.ts
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. is_listed
-- ---------------------------------------------------------------------------
-- Tier rows must stay purchasable (is_published = true, so priceCart accepts
-- them) while staying OUT of /courses and the track pages — otherwise the
-- catalog shows four near-identical 63-hour entries. is_published controls
-- "can this be bought"; is_listed controls "does it appear in listings".

alter table public.courses
  add column if not exists is_listed boolean not null default true;

comment on column public.courses.is_listed is
  'Show in catalog listings. False for pricing-tier variants that are sold from a landing page.';

-- ---------------------------------------------------------------------------
-- 2. The three tiers
-- ---------------------------------------------------------------------------
-- Prices are the discounted figures shown on the page (30% off), in cents:
--   Basic    $116.20   was $166
--   Premium  $175.00   was $250
--   Ultimate $203.00   was $290
--
-- Everything else (track, offering type, hours, pass mark) is inherited from
-- the parent course so a tier behaves identically once enrolled. Access length
-- differs by tier, matching the feature matrix: 6 months for Basic and
-- Premium, plus the 3-month extension for Ultimate.

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
  ('re-63-sales-associate-basic',
   '63-Hour Sales Associate Licensing Course — Basic',
   'State-approved 63-hour course, fully narrated.',
   11620, 180, 101),
  ('re-63-sales-associate-premium',
   '63-Hour Sales Associate Licensing Course — Premium',
   'Adds the state exam simulator and digital flashcards.',
   17500, 180, 102),
  ('re-63-sales-associate-ultimate',
   '63-Hour Sales Associate Licensing Course — Ultimate',
   'Adds unlimited exam re-activations and a 3-month extension.',
   20300, 270, 103)
) as t(slug, title, subtitle, price_cents, access_days, sort_order)
where c.slug = 're-63-sales-associate'
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
-- 3. Check
-- ---------------------------------------------------------------------------
select slug, title, price_cents, access_days, is_published, is_listed
from public.courses
where slug like 're-63-sales-associate%'
order by sort_order;
