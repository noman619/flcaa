-- =============================================================================
-- Tidy the two blog posts left over from the original seed
-- =============================================================================
--
-- The feed import brought in the 20 real posts. Two seeded placeholders were
-- not in the feed and so survived, both without a cover image:
--
--   salary-income-licensed-cam        duplicate — the feed's
--                                     "Compensation and Benefits for Licensed
--                                     Community Association Managers in Florida
--                                     (2026)" covers the same subject
--   hoa-board-member-certification-fl not on the original blog at all
--
-- This unpublishes the duplicate (kept, not deleted, so nothing that links to
-- it 404s) and gives the remaining post the cover image already sitting in
-- public/blog/.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

-- 1. Hide the duplicate. Set published_at back to a date to restore it.
update public.blog_posts
set published_at = null
where slug = 'salary-income-licensed-cam';

-- 2. The HOA post is ours, not the original's — keep it, give it its cover.
update public.blog_posts
set cover_image_url = '/blog/hoa-board-member-certification-fl.png',
    category        = 'board-members'
where slug = 'hoa-board-member-certification-fl';

-- ---------------------------------------------------------------------------
-- Check: every published post should now have a cover
-- ---------------------------------------------------------------------------
select
  count(*) filter (where published_at is not null)                          as published,
  count(*) filter (where published_at is not null and cover_image_url is null) as missing_cover
from public.blog_posts;
