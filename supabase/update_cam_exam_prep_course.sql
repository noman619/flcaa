-- =============================================================================
-- Align the CAM exam prep product with the advertised page
-- =============================================================================
--
-- /florida-cam-exam-test-flashcards advertises $119 list, $69 payable, with
-- 6-month unlimited access. The catalog row still carried seed placeholders, so
-- a visitor reaching the product through /courses saw a different price from
-- the one on the marketing page, and the cart charged the placeholder.
--
-- Like the real estate practice exam (and UNLIKE the CAM licensing tiers),
-- price_cents stores the PAYABLE price and the $119 is a display-only anchor in
-- the page copy. The cut is ~42%, not the 30% site promotion, and the original
-- page carries no promo banner — so this slug is deliberately absent from
-- PROMO.slugs (src/lib/promo.ts). Adding it would stack a second 30% and charge
-- $48.30.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
set title       = 'Florida CAM License State Exam Preparation',
    subtitle    = 'State exam simulations and flashcards',
    description = 'Pass your Florida Community Association Manager test the first time - Guaranteed.',
    price_cents = 6900,   -- payable price; $119 is the anchor shown on the page
    access_days = 180,    -- 6-month unlimited access, as advertised
    updated_at  = now()
where slug = 'cam-exam-prep';

-- ---------------------------------------------------------------------------
-- Check: payable_cents must read 6900
-- ---------------------------------------------------------------------------
select slug, title, price_cents as payable_cents, access_days
from public.courses
where slug = 'cam-exam-prep';
