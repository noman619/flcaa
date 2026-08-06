-- =============================================================================
-- Strip the remaining bold markers inside headings
-- =============================================================================
--
-- The previous script removed bold that wrapped a whole heading. Eight headings
-- bold only part of the line, so they were left behind:
--
--   ## **3.** The school must offer practice questions for the state exam.
--   ## **Tip 4**: Swiftly Submit Your Real Estate License Application
--   ### **I**gnoring Florida-specific content
--
-- A single regexp_replace cannot strip an unknown number of ** pairs from one
-- line, so this loops until no row changes. The loop is capped so a stray
-- unpaired ** can never spin forever.
--
-- Only heading lines are touched; ** inside body copy is left alone.
--
-- Safe to re-run.
-- =============================================================================

do $$
declare
  changed integer;
  passes  integer := 0;
begin
  loop
    update public.blog_posts
    set body_markdown = regexp_replace(
          body_markdown,
          '^(#{1,4}[^\r\n]*?)\*\*([^\r\n]*?)\*\*',
          '\1\2',
          'gn'
        )
    where body_markdown ~ '(?n)^#{1,4}[^\r\n]*\*\*[^\r\n]*\*\*';

    get diagnostics changed = row_count;
    passes := passes + 1;
    exit when changed = 0 or passes >= 10;
  end loop;

  raise notice 'passes: %', passes;
end $$;

-- ---------------------------------------------------------------------------
-- Check: should be 0
-- ---------------------------------------------------------------------------
select count(*) as posts_with_bold_in_headings
from public.blog_posts
where body_markdown ~ '(?n)^#{1,4}[^\r\n]*\*\*';
