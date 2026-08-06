-- =============================================================================
-- Align the Mutual Recognition exam prep product with the advertised page
-- =============================================================================
--
-- The catalog row carried placeholder data ($39.00, 180-day access, a generic
-- title), while the landing page advertises the real product: $142 list, 30%
-- off to $99, 4-month access. A visitor reaching it through /courses saw a
-- different price from the one on the marketing page.
--
-- price_cents is the LIST price. The 30% promotion is applied server-side in
-- priceCart (src/lib/promo.ts), which now includes this slug, so the payable
-- amount comes out at $99.40 — see the note below.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
set title       = 'Florida Real Estate Mutual Recognition Exam Prep Course',
    subtitle    = 'Pass the 40-question Florida law exam',
    description = 'You are already licensed in one of the 10 mutual recognition states, you don''t need the full course—you just need to pass the 40-question law exam. This program is designed to help you do exactly that.',
    price_cents = 14200,  -- $142 list; the promo takes it to $99.40
    access_days = 120,    -- 4-month access, as advertised
    updated_at  = now()
where slug = 're-mutual-recognition-exam-prep';

-- ---------------------------------------------------------------------------
-- Check
-- ---------------------------------------------------------------------------
select
  slug,
  title,
  price_cents                              as list_cents,
  round(price_cents * 0.30)                as promo_discount_cents,
  price_cents - round(price_cents * 0.30)  as payable_cents,
  access_days
from public.courses
where slug = 're-mutual-recognition-exam-prep';
