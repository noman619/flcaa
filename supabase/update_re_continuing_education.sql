-- =============================================================================
-- 14-Hour Real Estate Continuing Education: the price the landing page shows
-- =============================================================================
--
-- /fl-real-estate-continuing-education sells the 14-hour CE bundle at $24,
-- struck through from $35 ("Save 30%"). The catalog held $29, so the cart
-- contradicted the page — prices are resolved server-side from
-- courses.price_cents (see priceCart in src/lib/fulfillment.ts).
--
-- $35 is the advertised anchor only. It lives in LIST_PRICES
-- (src/lib/promo.ts) so the cart can show the saving; nothing charges it, and
-- this slug is not in PROMO.slugs so the two discounts cannot stack.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
   set price_cents = 2400,
       updated_at  = now()
 where slug = 're-continuing-education';

-- Check: expect 2400.
select slug, title, hours, price_cents
  from public.courses
 where slug = 're-continuing-education';
