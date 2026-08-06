-- Florida CAM continuing education: price the catalog row as the landing page
-- advertises it.
--
-- https://www.flcaa.com/florida-cam-continuing-education sells the 2026 CE
-- bundle at $99, struck from $142. The seeded row carries $29, so the cart
-- charged a figure the page never shows.
--
-- price_cents holds the PAYABLE amount. The $142 anchor is display only and
-- lives in LIST_PRICES (src/lib/promo.ts) — this course is not part of the
-- "Back to School" promotion, so the two must never stack.

update public.courses
   set price_cents = 9900,
       updated_at  = now()
 where slug = 'cam-continuing-education';

-- Verify: expect one row at 9900.
select slug, title, price_cents
  from public.courses
 where slug = 'cam-continuing-education';
