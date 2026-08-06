-- =============================================================================
-- The remaining blog posts, and category corrections
-- =============================================================================
--
-- The RSS feed only returns the 20 most recent posts. blog-posts-sitemap.xml
-- lists all 29, so the last 9 were fetched from their own pages (title and
-- excerpt from their meta tags, cover from the sitemap's image entry).
--
-- It also fixes the Board Members tab. Categories were first derived by keyword
-- and mis-sorted: HOA and condo governance articles mention "CAMs" throughout,
-- so several landed under CAM. The tab now holds exactly the posts the original
-- shows, set explicitly.
--
-- Safe to re-run. Run in the Supabase SQL editor.
-- =============================================================================

insert into public.blog_posts (slug, title, excerpt, cover_image_url, category, published_at)
values
  ('how-to-renew-your-florida-real-estate-license-a-step-by-step-guide-for-busy-agents', 'How to Renew Your Florida Real Estate License in 2025', 'Learn Florida real estate license renewal requirements: post-licensing education, continuing education hours, DBPR deadlines, and fees to avoid penalties.', '/blog/how-to-renew-your-florida-real-estate-license-a-step-by-step-guide-for-busy-agents.jpg', 'real-estate', '2025-08-03T14:01:14.464Z'),
  ('what-does-a-community-association-manager-do', 'What does a community association manager do?', 'In this article we answer questions like, “What does a community association manager do?”, “How much money managers earn?”, and “How do you get a CAM license?”', '/blog/what-does-a-community-association-manager-do.jpg', 'board-members', '2025-09-12T14:34:53.574Z'),
  ('property-management-license-fl', 'How to Obtain Your Property Management License in Florida', 'Learn how to obtain a property management license in Florida. Our easy step-by-step guide will help you get closer to your dream job right now.', '/blog/property-management-license-fl.jpg', 'real-estate', '2025-01-09T17:13:57.178Z'),
  ('requirements-for-real-estate-continuing-education', 'Real Estate License Renewal | Florida Requirements', 'Florida real estate continuing education requirements. Real estate professionals are required to renew their license every 2 years.', '/blog/requirements-for-real-estate-continuing-education.jpg', 'real-estate', '2025-09-16T16:51:11.832Z'),
  ('responsibilities-of-a-condo-property-manager', 'Responsibilities of a Condo Property Manager', 'Property managers have a lot of duties, and as a board member, you must hire a competent one. The Florida condo board certification course can help you.', '/blog/responsibilities-of-a-condo-property-manager.jpg', 'board-members', '2025-09-09T07:03:44.009Z'),
  ('newly-elected-condo-hoa-coop-board-members-must-take-certification-course-florida', 'Condo HOA Board Certification Requirement in Florida', 'Florida Statutes provides that newly elected directors in condo, HOAs, and coop associations must complete a certification course. Prolicense School.', '/blog/newly-elected-condo-hoa-coop-board-members-must-take-certification-course-florida.jpg', 'board-members', '2025-06-11T13:47:39.000Z'),
  ('common-mistakes-of-board-members', 'Common Mistakes of Board Members in Florida', 'It can be a wonderful experience being on the board of a condo or homeowner’s association in Florida. Prolicense School.', '/blog/common-mistakes-of-board-members.jpg', 'board-members', '2025-08-14T03:36:48.863Z'),
  ('what-makes-a-good-hoa-board-member', 'What makes a good HOA board member?', 'Board members mostly look after the betterment of the residents and homeowners in the community. HOA board members are volunteers in Florida.', '/blog/what-makes-a-good-hoa-board-member.jpg', 'board-members', '2025-08-01T20:47:45.822Z'),
  ('should-you-get-your-cam-license', 'Should You get Your CAM License?', 'Read on below for a few of those top benefits to be revealed, then get ready to study for your Florida CAM license exam.', '/blog/should-you-get-your-cam-license.jpg', 'cam', '2025-04-16T01:47:18.555Z')
on conflict (slug) do update
set title           = excluded.title,
    excerpt         = excluded.excerpt,
    cover_image_url = excluded.cover_image_url,
    category        = excluded.category,
    published_at    = excluded.published_at;

-- ---------------------------------------------------------------------------
-- Board Members tab
-- ---------------------------------------------------------------------------
update public.blog_posts set category = 'board-members'
where slug in (
  'condo-board-members-conflicts-of-interests-service-providers-in-florida',
  'legislation-impacting-florida-homeowners-associations',
  '2024-legislation-impacting-florida-condominium-associations',
  'condo-coop-hoa-what-difference',
  'common-mistakes-of-board-members',
  'what-makes-a-good-hoa-board-member',
  'newly-elected-condo-hoa-coop-board-members-must-take-certification-course-florida'
);

-- Manager-role articles are CAM, not board governance.
update public.blog_posts set category = 'cam'
where slug in (
  'what-are-the-essential-duties-of-an-hoa-manager',
  'what-does-a-community-association-manager-do',
  'responsibilities-of-a-condo-property-manager'
);

-- ---------------------------------------------------------------------------
-- Posts that are not on the original blog
-- ---------------------------------------------------------------------------
-- Two seeded placeholders predate the import. Unpublished rather than deleted,
-- so anything linking to them still resolves. Set published_at to restore.
update public.blog_posts
set published_at = null
where slug in ('hoa-board-member-certification-fl', 'salary-income-licensed-cam');

-- ---------------------------------------------------------------------------
-- Check: Board Members should be exactly 7
-- ---------------------------------------------------------------------------
select category, count(*) as posts
from public.blog_posts
where published_at is not null
group by category
order by category;
