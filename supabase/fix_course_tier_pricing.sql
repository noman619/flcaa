-- =============================================================================
-- Align the catalog 63-hour course with the prices actually advertised
-- =============================================================================
--
-- The base product still carried $199.00, which appears nowhere on the site.
-- The landing page sells the same course at $116.20 / $175.00 / $203.00, so a
-- visitor arriving via /courses was quoted a price that does not exist.
--
-- This points the catalog entry at the real entry price (Basic, $116.20) so the
-- catalog and the landing page agree. The tier variants keep their own prices
-- and stay unlisted — they are sold from the landing page, where the feature
-- matrix explains what separates them.
--
-- Safe to re-run.
--
-- Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
set price_cents = 11620,   -- $116.20, the advertised entry price
    access_days = 180,     -- 6-month access, matching the feature matrix
    updated_at  = now()
where slug = 're-63-sales-associate';

-- ---------------------------------------------------------------------------
-- Check: the whole 63-hour family, listed entry first
-- ---------------------------------------------------------------------------
select slug, price_cents, access_days, is_published, is_listed
from public.courses
where slug like 're-63-sales-associate%'
order by is_listed desc, sort_order;
