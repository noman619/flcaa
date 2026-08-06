-- =============================================================================
-- Broker exam prep: the price and name the shelf advertises
-- =============================================================================
--
-- /real-estate-exam-prep sells one product, the "Florida Real Estate Broker
-- Drill and Practice QBank v10.0", at $69. The catalog held "Broker State Exam
-- Prep" at $49, so the cart contradicted the page — prices are resolved
-- server-side from courses.price_cents (see priceCart in
-- src/lib/fulfillment.ts), never from the page.
--
-- The title is what the cart, order and receipt show, so it matches the shelf.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
   set title       = 'Florida Real Estate Broker Drill and Practice QBank v10.0',
       subtitle    = 'Stay on Top of Your Review with the Latest QBank',
       price_cents = 6900,
       updated_at  = now()
 where slug = 're-broker-exam-prep';

-- Check: expect 6900.
select slug, title, subtitle, price_cents
  from public.courses
 where slug = 're-broker-exam-prep';
