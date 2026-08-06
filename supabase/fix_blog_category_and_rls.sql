-- =============================================================================
-- 1. Move the property-management post into CAM
-- 2. Fix the RLS recursion that makes blog_posts 500 past ~29 rows
-- =============================================================================
--
-- Run in the Supabase SQL editor.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Category correction
-- ---------------------------------------------------------------------------
-- "Requirements for Obtaining a Florida Property Management License" sits under
-- CAM on the original; the keyword pass read "license" and filed it as real
-- estate.

update public.blog_posts
set category = 'cam'
where slug = 'property-management-license-fl';

-- ---------------------------------------------------------------------------
-- 2. The recursion
-- ---------------------------------------------------------------------------
-- Symptom: selecting all rows returns
--   54001 "stack depth limit exceeded"
-- and it appears at ~30 rows. It is not a data-size problem — raising
-- max_stack_depth will not fix it.
--
-- Cause: the SELECT policy on blog_posts checks admin rights with an inline
--   exists (select 1 from profiles where id = auth.uid() and role = 'admin')
-- Reading profiles re-triggers profiles' own policy, which does the same check,
-- and so on. Postgres aborts once the nesting exhausts the stack. Every row
-- evaluated adds a level, so small tables survive and larger ones do not. The
-- same fault is why profiles, coupons and exam_questions already 500 outright.
--
-- Fix: do the admin check in a SECURITY DEFINER function. Definer rights bypass
-- RLS inside the function, so the cycle is broken. Costs one lookup per query
-- instead of one per row, so it is also faster.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- Policies only take effect when RLS is on. Asserting it here so dropping and
-- recreating the policies can never leave the table world-readable.
alter table public.blog_posts enable row level security;

-- Rebuild the blog_posts read policies on top of it. Published posts are public;
-- drafts are admin-only.
drop policy if exists "blog_posts_select" on public.blog_posts;
drop policy if exists "blog_posts_read" on public.blog_posts;
drop policy if exists "Public can read published posts" on public.blog_posts;
drop policy if exists "blog_posts_public_read" on public.blog_posts;
drop policy if exists "blog_posts_admin_read" on public.blog_posts;

create policy "blog_posts_public_read"
  on public.blog_posts for select
  using (published_at is not null);

create policy "blog_posts_admin_read"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Check: this select is what used to fail
-- ---------------------------------------------------------------------------
select category, count(*) as posts
from public.blog_posts
where published_at is not null
group by category
order by category;
