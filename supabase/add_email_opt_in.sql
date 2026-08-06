-- =============================================================================
-- Email notification preference
-- =============================================================================
--
-- Backs the "Get Notifications by Email" checkbox on the cart. Without a column
-- the checkbox would be a control that remembers nothing, which is worse than
-- not offering it — a customer who unticks it would still be emailed.
--
-- Default true matches the checkbox's default state on the original checkout.
--
-- This covers marketing/status updates only. Transactional mail (order receipts,
-- password resets, course completion) is sent regardless, as it must be.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

alter table public.profiles
  add column if not exists email_opt_in boolean not null default true;

comment on column public.profiles.email_opt_in is
  'Customer wants order-status and marketing email. Transactional mail ignores this.';

select id, full_name, email_opt_in
from public.profiles
limit 5;
