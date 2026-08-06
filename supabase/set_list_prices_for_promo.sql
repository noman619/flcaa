-- =============================================================================
-- Store LIST prices so the 30% promotion can actually be applied
-- =============================================================================
--
-- RUN THIS NOW — the app already computes the promotion.
--
-- The prices in `courses` were the post-discount figures ($116.20 / $175.00 /
-- $203.00), which is why the "30% OFF August Deal" never appeared as a line:
-- the discount was baked in, so there was nothing left to take off.
--
-- The deal is now applied server-side in priceCart (see src/lib/promo.ts), so
-- these rows must hold the LIST price. Until this runs, the promotion is taken
-- off an already-discounted price and customers are undercharged:
--
--     stored 11620  ->  11620 - 30%  =  8134   ($81.34)  WRONG
--     stored 16600  ->  16600 - 30%  = 11620  ($116.20)  correct
--
-- Safe to re-run.
--
-- Run in the Supabase SQL editor.
-- =============================================================================

update public.courses set price_cents = 16600, updated_at = now()
where slug in ('re-63-sales-associate', 're-63-sales-associate-basic');

update public.courses set price_cents = 25000, updated_at = now()
where slug = 're-63-sales-associate-premium';

update public.courses set price_cents = 29000, updated_at = now()
where slug = 're-63-sales-associate-ultimate';

-- ---------------------------------------------------------------------------
-- Check: list price, and what the visitor will actually pay
-- ---------------------------------------------------------------------------
select
  slug,
  price_cents                              as list_cents,
  round(price_cents * 0.30)                as promo_discount_cents,
  price_cents - round(price_cents * 0.30)  as payable_cents
from public.courses
where slug like 're-63-sales-associate%'
order by sort_order;
