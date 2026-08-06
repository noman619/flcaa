-- =============================================================================
-- Blog posts, imported from the original site's feed
-- =============================================================================
--
-- Source: https://www.flcaa.com/blog-feed.xml (all 20 published posts).
-- Titles, excerpts, slugs and publish dates are the originals; cover images
-- were downloaded to public/blog/<slug>.jpg so the site serves its own assets
-- rather than hot-linking someone else's CDN.
--
-- `category` backs the All Posts / Real Estate / CAM / Board Members tabs and
-- is derived from each post's subject matter.
--
-- Bodies are NOT imported — the feed only carries excerpts. Each post keeps
-- body_markdown null until the full copy is ported, and the blog UI links out
-- accordingly.
--
-- Safe to re-run: ON CONFLICT (slug) DO UPDATE.
-- Run in the Supabase SQL editor.
-- =============================================================================

alter table public.blog_posts
  add column if not exists category text not null default 'real-estate';

comment on column public.blog_posts.category is
  'Blog filter tab: real-estate | cam | board-members';

insert into public.blog_posts (slug, title, excerpt, cover_image_url, category, published_at)
values
  ('condo-board-members-conflicts-of-interests-service-providers-in-florida', 'Conflicts of Interest and Service Providers: Why Condominium Board Members Must Not Cross the Line', 'Florida condominium board members are responsible for a mind-boggling number of activities that must be performed according to the rules set forth in the Condominium Act, Florida Statute 718 . It’s all too easy to make an error, and there are always a few owners who seem poised t', '/blog/condo-board-members-conflicts-of-interests-service-providers-in-florida.jpg', 'board-members', '2026-02-23T04:21:33.000Z'),
  ('legislation-impacting-florida-homeowners-associations', 'Florida HOA Laws: A Compliance Guide to Chapter 720 (2026 Update)', 'Since the landmark legislation of July 1, 2024, Florida Homeowners'' Associations (HOAs) have been operating under significantly stricter regulations. For boards and Community Association Managers (CAMs) in 2026, these "new" laws are now the standard for daily operations. Failure ', '/blog/legislation-impacting-florida-homeowners-associations.jpg', 'cam', '2026-02-15T23:40:40.000Z'),
  ('2024-legislation-impacting-florida-condominium-associations', 'Florida Condo Laws: A Compliance Guide to Chapter 718 (2026 Update)', 'Following the sweeping legislation of 2024 (specifically House Bill 1021 ), Florida Condominium Associations have entered a new era of strict regulatory oversight. For boards and managers in 2026, the "transitional" phase is over. These laws are now the standard operating procedu', '/blog/2024-legislation-impacting-florida-condominium-associations.jpg', 'board-members', '2026-02-15T23:24:51.000Z'),
  ('florida-real-estate-license-reciprocity', 'Understanding Florida''s Real Estate License Reciprocity with Other States', 'Will Florida recognize your license from another state? Florida has mutual recognition with 10 states.', '/blog/florida-real-estate-license-reciprocity.jpg', 'real-estate', '2026-02-09T20:48:20.000Z'),
  ('florida-real-estate-exam-prep-course-what-top-performers-know-2026-guide', 'Florida Real Estate Exam Prep Course: What Top Performers Know [2026 Guide]', 'The Florida real estate exam challenges candidates with a 50% first-attempt failure rate. This comprehensive guide reveals proven strategies to pass the 100-question test requiring 75% to succeed. Learn smart preparation techniques, avoid common mistakes, and discover top-rated p', '/blog/florida-real-estate-exam-prep-course-what-top-performers-know-2026-guide.jpg', 'real-estate', '2026-02-02T16:50:27.000Z'),
  ('salary-income-money-licensed-cam-community-association-manager-florida', 'Compensation and Benefits for Licensed Community Association Managers in Florida (2026)', 'How much money does a community association manager (CAM) make in Florida? The Bureau of Labor Statistics in 2025 reported the average salary of a licensed Community Association Manager in Florida was approximately $71,257 per year, with this salary varying depending on location ', '/blog/salary-income-money-licensed-cam-community-association-manager-florida.jpg', 'cam', '2026-01-30T15:39:03.000Z'),
  ('what-are-the-essential-duties-of-an-hoa-manager', 'What are the Essential Duties of an HOA Manager?', 'Learn what are the duties of an HOA manager and how an HOA board member certification can help you hire the best talent to manage a homeo...', '/blog/what-are-the-essential-duties-of-an-hoa-manager.jpg', 'board-members', '2026-01-25T13:37:38.000Z'),
  ('best-online-florida-real-estate-school', 'The Best Online Florida Real Estate School for You', 'How do you select the best Florida real estate school for you?', '/blog/best-online-florida-real-estate-school.jpg', 'real-estate', '2026-01-23T20:37:23.000Z'),
  ('what-is-the-difference-between-a-real-estate-agent-and-broker', 'Real Estate Agent vs Broker - What’s The Difference in Florida?', 'Understand the differences between a real estate agent and a broker.', '/blog/what-is-the-difference-between-a-real-estate-agent-and-broker.jpg', 'real-estate', '2026-01-18T16:48:48.000Z'),
  ('how-to-pass-florida-cam-license-exam-the-first-time', 'How to Pass the Florida CAM License Exam the First Time?', '1 . You have plenty of time You are given 3 hours to fill in your answers. Take a long deep breath, trust yourself, your preparation, and do not rush. 2 . Read every question…twice! Our brain can sometimes play sneaky tricks on us and make us think we read a word that wasn’t even', '/blog/how-to-pass-florida-cam-license-exam-the-first-time.jpg', 'cam', '2026-01-17T04:11:00.000Z'),
  ('condo-coop-hoa-what-difference', 'Condominium, Co-op, and HOA - What’s the Difference?', 'There is some confusion about the differences between a condominium, a homeowners’ association, and a cooperative. Residents of these communities use the terms “homeowners” or “property owners” to describe themselves as a group. If you live in one of these types of communities, i', '/blog/condo-coop-hoa-what-difference.jpg', 'board-members', '2026-01-06T15:51:27.000Z'),
  ('florida-real-estate-license-fast', 'Florida Real Estate License in 5 Weeks: Your Fast Track to a Rewarding Career', 'Embark on a fulfilling journey in one of the most dynamic real estate markets in the U.S. Here’s how you can get your Florida real estate license swiftly and efficiently. You''ll want to swiftly navigate the process of obtaining your license, ensuring no time is wasted on your pat', '/blog/florida-real-estate-license-fast.jpg', 'real-estate', '2025-12-27T21:10:54.000Z'),
  ('is-it-difficult-to-become-a-real-estate-agent', 'Is it Difficult for an Introvert to Become a Real Estate Agent?', 'There is a common misconception that introverts can’t become good real estate agents. But the reality is otherwise. Read on to know how...', '/blog/is-it-difficult-to-become-a-real-estate-agent.jpg', 'real-estate', '2025-12-15T16:42:02.000Z'),
  ('digital-landscape-of-real-estate-education-in-florida', 'Navigating the Digital Landscape of Real Estate Education in Florida', 'In the dynamic world of real estate, staying ahead of the curve is crucial. In Florida, a state known for its bustling property market, real estate professionals must constantly update their knowledge and skills. Thankfully, the rise of online education has made this task more ac', '/blog/digital-landscape-of-real-estate-education-in-florida.jpg', 'real-estate', '2025-12-15T05:00:00.000Z'),
  ('launching-your-real-estate-career-in-florida', 'Launching Your Real Estate Career in Florida: A Guide for New Agents', 'Starting a career in real estate in Florida can be an exciting and rewarding journey, especially after passing the Florida State exam . This blog post will guide you through the essential steps you need to take to successfully launch your career in this dynamic field. 1. Understa', '/blog/launching-your-real-estate-career-in-florida.jpg', 'real-estate', '2025-12-15T05:00:00.000Z'),
  ('top-career-benefits-of-obtaining-a-cam-license', 'Top Career Benefits of Obtaining a CAM License', 'If you haven’t thought of getting your CAM certification in Florida, read on to find out how getting a CAM license can benefit your real est', '/blog/top-career-benefits-of-obtaining-a-cam-license.jpg', 'cam', '2025-10-24T16:31:34.000Z'),
  ('florida-cam-license-renewal-guide', 'Florida CAM License Renewal: A Complete Guide for 2026', 'As a Community Association Manager (CAM) in Florida, keeping your license active is the bedrock of your career. The upcoming September 30, 2026, renewal deadline is approaching, and it''s essential to understand the specific requirements set by the Florida Department of Business &', '/blog/florida-cam-license-renewal-guide.jpg', 'cam', '2025-10-12T17:18:00.000Z'),
  ('florida-cam-hoa-ce-requirements-2026', 'Florida CAM HOA CE Requirements 2026', 'Are you a Community Association Manager (CAM) in Florida who provides services to Homeowners'' Associations (HOAs)? The Department of Business and Professional Regulation (DBPR) has implemented new, specific continuing education (CE) requirements for the 2024-2026 renewal cycle.', '/blog/florida-cam-hoa-ce-requirements-2026.jpg', 'cam', '2025-10-11T18:35:25.000Z'),
  ('is-the-florida-cam-test-hard', 'Is the Florida CAM test hard?', 'Passing the Florida CAM license test is a prerequisite for becoming a certified community association manager. We answer everything about ho', '/blog/is-the-florida-cam-test-hard.jpg', 'cam', '2025-09-23T14:29:26.000Z'),
  ('is-it-better-to-take-cam-courses-online-or-in-a-classroom', 'Is it Better to Take CAM courses Online or in a Classroom?', 'Having a CAM license is the most significant step for you to achieve more in the real estate business.', '/blog/is-it-better-to-take-cam-courses-online-or-in-a-classroom.jpg', 'cam', '2025-09-18T12:40:11.000Z')
on conflict (slug) do update
set title           = excluded.title,
    excerpt         = excluded.excerpt,
    cover_image_url = excluded.cover_image_url,
    category        = excluded.category,
    published_at    = excluded.published_at;

-- ---------------------------------------------------------------------------
-- Check
-- ---------------------------------------------------------------------------
select category, count(*) as posts
from public.blog_posts
group by category
order by category;
