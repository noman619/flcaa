-- =============================================================================
-- Align the Sales Associate exam prep product with the advertised page
-- =============================================================================
--
-- /florida-real-estate-practice-exam advertises $117 list, $67 payable, with
-- 6-month unlimited access. The catalog row still carried seed placeholders, so
-- a visitor reaching the product through /courses saw a different price from
-- the one on the marketing page, and the cart charged the placeholder.
--
-- Unlike the mutual-recognition product, this discount is NOT the site-wide
-- "Back to School" promotion — the original page shows no promo banner and the
-- cut is ~42.7%, not 30%. So price_cents stores the PAYABLE price ($67) and the
-- $117 is a display-only anchor in the page copy. This slug is deliberately
-- absent from PROMO.slugs (src/lib/promo.ts); adding it would stack a second
-- 30% on top and charge $46.90.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
set title       = 'Florida Real Estate Practice Exams',
    subtitle    = 'State exam simulations and flashcards',
    description = 'Real estate practice exams and flashcards that will boost your ability to pass the sales associates state exam in Florida. Get the most updated questions and answers designed to mimic what you''ll actually encounter on the licensing state test.',
    price_cents = 6700,   -- payable price; $117 is the anchor shown on the page
    access_days = 180,    -- 6-month unlimited access, as advertised
    updated_at  = now()
where slug = 're-sales-associate-exam-prep';

-- ---------------------------------------------------------------------------
-- Check: payable_cents must read 6700, and promo_applies must be false
-- ---------------------------------------------------------------------------
select
  slug,
  title,
  price_cents as payable_cents,
  access_days
from public.courses
where slug = 're-sales-associate-exam-prep';
