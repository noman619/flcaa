-- =============================================================================
-- 63-Hour Sales Associate: put the Basic tier back on its list price
-- =============================================================================
--
-- The landing page sells three tiers, each struck through from a list price
-- and discounted 30% by the "Back to School" promotion:
--
--   Basic     $166 -> $116.20
--   Premium   $250 -> $175.00
--   Ultimate  $290 -> $203.00
--
-- Premium (25000) and Ultimate (29000) hold their list price and let priceCart
-- apply the 30% (see PROMO in src/lib/promo.ts). Basic held 10000, which the
-- promotion then cut to $70.00 — a price that appears nowhere on the site and
-- undercuts the advertised one by $46.20.
--
-- The base row had the same problem from the other side: 18900 discounts to
-- $132.30, which is neither the catalog price nor any tier. It points at the
-- entry tier, so it carries Basic's list price and lands on $116.20 like the
-- landing page's cheapest option.
--
-- These are LIST prices on purpose. Every slug here is in PROMO.slugs, so
-- storing the discounted figure would apply the cut twice.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
   set price_cents = 16600,  -- $166 list -> $116.20 after the 30% promotion
       access_days = 180,
       updated_at  = now()
 where slug in ('re-63-sales-associate', 're-63-sales-associate-basic');

-- ---------------------------------------------------------------------------
-- Check: expect 16600 / 16600 / 25000 / 29000, i.e. $116.20 / $116.20 /
-- $175.00 / $203.00 once the promotion is applied.
-- ---------------------------------------------------------------------------
select slug,
       price_cents,
       round(price_cents * 0.7) as after_promo_cents,
       access_days,
       is_listed
  from public.courses
 where slug like 're-63-sales-associate%'
 order by is_listed desc, sort_order;
