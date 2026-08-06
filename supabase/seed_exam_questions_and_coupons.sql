-- =========================================================
-- Supplemental seed: exam question banks + coupon codes
--
-- Your project already has tracks, courses, modules, lessons and blog posts.
-- These two tables were empty, which leaves the exam-prep feature and the
-- checkout coupon field with nothing to show. Run this in the Supabase SQL
-- editor. It is idempotent — safe to run more than once.
-- =========================================================

-- ---------------------------------------------------------
-- Coupons
-- ---------------------------------------------------------
insert into public.coupons (code, percent_off, amount_off_cents, active, expires_at)
values
  ('WELCOME10', 10,   null, true, null),
  ('SAVE25',    null, 2500, true, null),
  ('FLASH20',   20,   null, true, now() + interval '30 days')
on conflict (code) do update
  set percent_off      = excluded.percent_off,
      amount_off_cents = excluded.amount_off_cents,
      active           = excluded.active,
      expires_at       = excluded.expires_at;

-- ---------------------------------------------------------
-- Exam questions — 63-Hour Sales Associate
-- ---------------------------------------------------------
insert into public.exam_questions (course_id, question, choices, correct_index, explanation)
select c.id, q.question, q.choices::jsonb, q.correct_index, q.explanation
from public.courses c
cross join (values
  (
    'Which Florida agency issues and regulates real estate sales associate licenses?',
    '["The Florida Real Estate Commission (FREC), under the DBPR","The Florida Department of Revenue","The Florida Association of Realtors","The county property appraiser"]',
    0,
    'FREC operates under the Department of Business & Professional Regulation (DBPR) and administers Chapter 475, F.S.'
  ),
  (
    'How many members serve on the Florida Real Estate Commission?',
    '["Five","Seven","Nine","Eleven"]',
    1,
    'FREC has seven members appointed by the Governor: four licensed brokers, one broker or sales associate, and two consumer members.'
  ),
  (
    'A sales associate may lawfully be paid a commission by:',
    '["Any party to the transaction","The buyer directly","Only their registered employing broker","The title company"]',
    2,
    'Under Chapter 475, a sales associate may only be compensated by the broker they are registered under.'
  ),
  (
    'Which of the following is real property rather than personal property?',
    '["A refrigerator that is not built in","A tenant''s trade fixture","An in-ground swimming pool","A rolled-up area rug"]',
    2,
    'An in-ground pool is permanently affixed to the land and therefore part of the real property.'
  ),
  (
    'The bundle of legal rights in real property includes all of the following EXCEPT:',
    '["The right of disposition","The right of exclusion","The right of enjoyment","The right to avoid all property taxes"]',
    3,
    'Property taxes are a government limitation on ownership (via the power of taxation), not one of the ownership rights.'
  ),
  (
    'How long does an initial Florida sales associate license remain valid before the first renewal?',
    '["6 to 12 months","12 to 18 months","18 to 24 months","24 to 36 months"]',
    2,
    'The initial license expires at the end of the renewal cycle, giving between 18 and 24 months before the first renewal.'
  ),
  (
    'A listing agreement that guarantees the broker a commission no matter who sells the property is a:',
    '["Open listing","Exclusive agency listing","Exclusive right of sale listing","Net listing"]',
    2,
    'An exclusive right of sale listing pays the broker even if the seller finds the buyer themselves.'
  ),
  (
    'Escrow funds received by a sales associate must be delivered to the broker:',
    '["Within 1 business day","Immediately, and no later than the end of the next business day","Within 3 business days","Within 10 business days"]',
    1,
    'Chapter 475 requires immediate delivery, defined as no later than the end of the next business day.'
  ),
  (
    'Which type of deed offers the grantee the greatest protection?',
    '["Quitclaim deed","Special warranty deed","General warranty deed","Bargain and sale deed"]',
    2,
    'A general warranty deed warrants against defects arising at any point in the property''s history, not just the grantor''s period of ownership.'
  ),
  (
    'The Florida documentary stamp tax on a deed is calculated on:',
    '["The assessed value","The total purchase price or consideration","The loan amount only","The appraised value minus the down payment"]',
    1,
    'Documentary stamp tax on deeds is based on the total consideration paid for the property.'
  ),
  (
    'A broker who represents both buyer and seller in the same transaction in Florida is operating as a:',
    '["Dual agent","Transaction broker","Single agent for both parties","Designated sales associate"]',
    1,
    'Florida abolished dual agency. The default relationship is transaction broker, which provides limited representation to both parties.'
  ),
  (
    'Which appraisal approach is most appropriate for valuing a single-family home?',
    '["Cost approach","Income capitalisation approach","Sales comparison approach","Gross rent multiplier"]',
    2,
    'The sales comparison approach uses recent sales of comparable properties and is the primary method for residential valuation.'
  )
) as q(question, choices, correct_index, explanation)
where c.slug = 're-63-sales-associate'
  and not exists (
    select 1 from public.exam_questions e
    where e.course_id = c.id and e.question = q.question
  );

-- ---------------------------------------------------------
-- Exam questions — Sales Associate State Exam Prep
-- (shares the same bank so the exam-prep product has content)
-- ---------------------------------------------------------
insert into public.exam_questions (course_id, question, choices, correct_index, explanation)
select prep.id, e.question, e.choices, e.correct_index, e.explanation
from public.courses prep
join public.courses src on src.slug = 're-63-sales-associate'
join public.exam_questions e on e.course_id = src.id
where prep.slug = 're-sales-associate-exam-prep'
  and not exists (
    select 1 from public.exam_questions x
    where x.course_id = prep.id and x.question = e.question
  );

-- ---------------------------------------------------------
-- Exam questions — CAM Licensing Course
-- ---------------------------------------------------------
insert into public.exam_questions (course_id, question, choices, correct_index, explanation)
select c.id, q.question, q.choices::jsonb, q.correct_index, q.explanation
from public.courses c
cross join (values
  (
    'Which Florida Statute chapter governs condominium associations?',
    '["Chapter 718","Chapter 719","Chapter 720","Chapter 721"]',
    0,
    'Chapter 718, F.S. is the Condominium Act. Chapter 719 covers cooperatives and Chapter 720 covers homeowners'' associations.'
  ),
  (
    'Which Florida Statute chapter governs homeowners'' associations?',
    '["Chapter 718","Chapter 719","Chapter 720","Chapter 723"]',
    2,
    'Chapter 720, F.S. is the Homeowners'' Association Act.'
  ),
  (
    'A community association manager license is required when managing an association with more than:',
    '["10 units or an annual budget over $50,000","10 units or an annual budget over $100,000","25 units or an annual budget over $100,000","50 units regardless of budget"]',
    1,
    'Licensure is required for associations with more than 10 units OR an annual budget in excess of $100,000.'
  ),
  (
    'Reserve funds in a condominium association may generally be used for other purposes only if:',
    '["The board votes unanimously","A majority of the total voting interests approves it","The manager authorises it in writing","The budget shows a surplus"]',
    1,
    'Diverting reserves requires approval by a majority of the total voting interests at a duly called meeting.'
  ),
  (
    'The official records of a condominium association must generally be made available to a unit owner within:',
    '["3 business days of a written request","5 business days","10 business days","30 calendar days"]',
    2,
    'Chapter 718 requires official records to be available for inspection within 10 business days of a written request.'
  ),
  (
    'A CAM licensee who commingles association funds with personal funds is:',
    '["Acting within their authority if repaid promptly","Committing a violation subject to discipline","Permitted with board approval","Only in breach if a loss occurs"]',
    1,
    'Commingling is a serious violation of the CAM standards of professional conduct regardless of whether a loss results.'
  ),
  (
    'How many CE hours are required for a CAM licensee each biennial renewal cycle?',
    '["10 hours","15 hours","20 hours","30 hours"]',
    2,
    'CAM licensees must complete 20 hours of approved continuing education each two-year renewal cycle.'
  ),
  (
    'An association''s annual budget meeting notice must generally be mailed or delivered to unit owners at least:',
    '["48 hours in advance","7 days in advance","14 days in advance","30 days in advance"]',
    2,
    'Chapter 718 requires at least 14 days'' notice of the meeting at which the budget will be considered.'
  )
) as q(question, choices, correct_index, explanation)
where c.slug = 'cam-licensing-course'
  and not exists (
    select 1 from public.exam_questions e
    where e.course_id = c.id and e.question = q.question
  );

-- CAM exam prep shares the CAM bank
insert into public.exam_questions (course_id, question, choices, correct_index, explanation)
select prep.id, e.question, e.choices, e.correct_index, e.explanation
from public.courses prep
join public.courses src on src.slug = 'cam-licensing-course'
join public.exam_questions e on e.course_id = src.id
where prep.slug = 'cam-exam-prep'
  and not exists (
    select 1 from public.exam_questions x
    where x.course_id = prep.id and x.question = e.question
  );

-- ---------------------------------------------------------
-- Exam questions — Board Director Certification
-- ---------------------------------------------------------
insert into public.exam_questions (course_id, question, choices, correct_index, explanation)
select c.id, q.question, q.choices::jsonb, q.correct_index, q.explanation
from public.courses c
cross join (values
  (
    'A newly elected condominium board member must, within 90 days of election, either certify in writing or:',
    '["Post a surety bond","Complete an approved board member education course","Pass a state examination","Hire a licensed CAM"]',
    1,
    'Directors must either sign the statutory certification or complete a state-approved educational curriculum within 90 days.'
  ),
  (
    'A board member who fails to satisfy the certification requirement within 90 days is:',
    '["Fined by the DBPR","Suspended from the board until compliance","Removed permanently","Personally liable for association debts"]',
    1,
    'The director is suspended from service until they comply, and the board may fill the vacancy in the interim.'
  ),
  (
    'The fiduciary duty owed by an association director runs to:',
    '["The property manager","The association and its members as a whole","The developer","Only the members who voted for them"]',
    1,
    'Directors owe a fiduciary duty to the association and all of its members, not to any individual faction.'
  ),
  (
    'Board meetings at which non-emergency special assessments will be considered require notice of at least:',
    '["48 hours posted","14 days mailed, delivered or electronically transmitted","30 days","No specific notice"]',
    1,
    'Special assessments require 14 days'' notice, and the notice must state the nature of the assessment.'
  ),
  (
    'A director with a conflict of interest in a proposed contract should:',
    '["Vote normally, since board seats are voluntary","Disclose the conflict and abstain from voting","Resign from the board","Ask the manager to decide"]',
    1,
    'Disclosure plus abstention protects both the director and the association from a voidable transaction.'
  ),
  (
    'Official records requests from members must be answered within:',
    '["10 business days","10 calendar days","30 days","A reasonable time"]',
    0,
    'Ten business days is the statutory window; failure creates a rebuttable presumption of willful non-compliance.'
  )
) as q(question, choices, correct_index, explanation)
where c.slug = 'board-director-certification'
  and not exists (
    select 1 from public.exam_questions e
    where e.course_id = c.id and e.question = q.question
  );

-- ---------------------------------------------------------
-- Verify
-- ---------------------------------------------------------
select c.slug, count(e.id) as questions
from public.courses c
left join public.exam_questions e on e.course_id = c.id
group by c.slug
order by questions desc, c.slug;
