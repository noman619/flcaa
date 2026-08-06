-- =============================================================================
-- Strip bold markers from article headings
-- =============================================================================
--
-- A few headings in the original are wrapped in <strong> inside the <h2>, so
-- the Markdown conversion produced "## **3) Simply get your ...**". That renders
-- as one heavier heading among otherwise regular ones — 46 of them across 10
-- posts, worst in the HOA and condo law guides.
--
-- NOTE on the regex flags: Postgres anchors ^ and $ to the start and end of the
-- whole string unless newline-sensitive matching is requested. The first version
-- of this script guarded with `where body_markdown ~ '^#{1,4}...'`, which
-- therefore matched nothing and the update silently did nothing. Both the filter
-- and the replacement now use the 'n' flag, via (?n) and 'gn' respectively.
--
-- Safe to re-run, and independent of the other blog scripts.
-- =============================================================================

update public.blog_posts
set body_markdown = regexp_replace(
      body_markdown,
      '^(#{1,4})[ ]+\*\*(.+?)\*\*[ \r]*$',
      '\1 \2',
      'gn'
    )
where body_markdown ~ '(?n)^#{1,4}[ ]+\*\*';

-- ---------------------------------------------------------------------------
-- Check: both counts should be 0
-- ---------------------------------------------------------------------------
select
  count(*) filter (where body_markdown ~ '(?n)^#{1,4}[ ]+\*\*')  as posts_with_bold_headings,
  count(*)                                                        as posts
from public.blog_posts
where published_at is not null;
