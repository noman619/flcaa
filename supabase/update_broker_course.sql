-- =============================================================================
-- 72-Hour Broker course: the price the landing page advertises
-- =============================================================================
--
-- /florida-real-estate-broker-license-course sells the broker course at $229,
-- struck through from $279. The catalog held $249, so the cart contradicted
-- the page — prices are resolved server-side from courses.price_cents (see
-- priceCart in src/lib/fulfillment.ts), never from the page.
--
-- $279 is the advertised anchor only. It lives in LIST_PRICES
-- (src/lib/promo.ts) so the cart can show the saving; it is not a second
-- price and nothing charges it. This course is NOT part of the "Back to
-- School" promotion, so the two discounts cannot stack.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
   set price_cents = 22900,
       updated_at  = now()
 where slug = 're-72-broker';

-- Check: expect 22900.
select slug, title, hours, price_cents, is_listed
  from public.courses
 where slug = 're-72-broker';
