-- =============================================================================
-- 45-Hour Sales Associate Post-License: the price the landing page advertises
-- =============================================================================
--
-- /florida-real-estate-45-hour-post-license-course sells the 45-hour post
-- license course at $109, struck through from $156 ("Save 30%"). The catalog
-- held $149, so the cart contradicted the page — prices are resolved
-- server-side from courses.price_cents (see priceCart in
-- src/lib/fulfillment.ts), never from the page.
--
-- $156 is the advertised anchor only. It lives in LIST_PRICES
-- (src/lib/promo.ts) so the cart can show the saving; nothing charges it.
-- This course is NOT in PROMO.slugs, so the "Back to School" discount cannot
-- stack on top of the 30% already baked into $109.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

update public.courses
   set price_cents = 10900,
       updated_at  = now()
 where slug = 're-45-sales-associate-post';

-- Check: expect 10900.
select slug, title, hours, price_cents
  from public.courses
 where slug = 're-45-sales-associate-post';
