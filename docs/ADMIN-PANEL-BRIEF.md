# Admin Panel Brief — Prolicense Florida (flcaa.com)

Hand this whole file to the agent building the admin panel. It describes the
public site it administers, the Supabase schema behind it, and the rules that
must not be broken.

---

## 1. What the public site is

A Next.js 16 (App Router, Turbopack, React 19, TypeScript strict) port of
flcaa.com, backed by Supabase. It sells Florida licensing education across
three tracks: **real estate**, **CAM** (community association manager) and
**board members** (condo/HOA/co-op directors).

Repo: https://github.com/noman619/flcaa · Tailwind v4 CSS-first tokens ·
`src/proxy.ts` replaces `middleware.ts`.

Two kinds of page, and the difference decides what an admin can change:

| Kind | Source of truth | Admin-editable |
| --- | --- | --- |
| Catalog pages (`/courses`, `/courses/[slug]`) | Supabase `courses` | yes |
| Marketing landing pages (`/florida-real-estate-license-course`, …) | prose in code, **prices from Supabase** | prices yes, prose no |
| Guides, legal, homepage sections | code | no |
| Blog | Supabase `blog_posts` | yes |

Prices are the important case: as of the DB-driven pricing change, **every
price shown on every page is read from `courses.price_cents`** through
`displayPrice()` (`src/lib/pricing.ts`), and the cart re-resolves the same row
server-side in `priceCart()` (`src/lib/fulfillment.ts`). An admin edit moves
the page and the checkout together. Never reintroduce a price as text.

---

## 2. Route map

### 2.1 Header navigation

**Real Estate** — `/real-estate` (two-level menu)

| Menu entry | Route | Catalog slug(s) |
| --- | --- | --- |
| Licensing Courses → 63-Hour Sales Associate | `/florida-real-estate-license-course` | `re-63-sales-associate` + `-basic` `-premium` `-ultimate` |
| Licensing Courses → 72-Hour Broker | `/florida-real-estate-broker-license-course` | `re-72-broker` |
| Post-Licensing → 45-Hour Sales Associate Post | `/florida-real-estate-45-hour-post-license-course` | `re-45-sales-associate-post` |
| Post-Licensing → 60-Hour Broker Post | `/real-estate-broker-post-licensing` | `re-60-broker-post` (+ `-investment`, `-brokerage`) |
| State Exam Prep → Sales Associate | `/florida-real-estate-practice-exam` | `re-sales-associate-exam-prep` |
| State Exam Prep → Mutual Recognition | `/florida-real-estate-mutual-recognition-exam-prep` | `re-mutual-recognition-exam-prep` |
| State Exam Prep → Broker | `/real-estate-exam-prep` | `re-broker-exam-prep` |
| Continuing Education | `/fl-real-estate-continuing-education` | `re-continuing-education` + `re-ce-business-ethics`, `re-ce-investors`, `re-ce-mortgages`, `re-ce-core-law` |
| Course Extension | `/real-estate-courses-extension` | `re-course-extension`, `re-course-extension-90`, `re-course-reenroll` |

**CAM** — `/cam`

| Menu entry | Route | Catalog slug(s) |
| --- | --- | --- |
| CAM Licensing Course | `/florida-cam-license-course-online` | `cam-licensing-course` + `-basic` `-premium` `-ultimate` |
| CAM Continuing Education | `/florida-cam-continuing-education` | `cam-continuing-education` + `cam-ce-legal-updates-2026`, `cam-ce-problems-conflicts`, `cam-ce-collect-dues`, `cam-ce-preventive-maintenance`, `cam-ce-prevent-theft-fraud` |
| State Exam Prep | `/florida-cam-exam-test-flashcards` | `cam-exam-prep` |
| Course Extension | `/get-course-extension-retake` | `cam-course-extension`, `cam-course-extension-90`, `cam-course-reenroll` |

**Board Members** — `/board-members`

| Menu entry | Route | Catalog slug(s) |
| --- | --- | --- |
| Board Certification | `/board-certification-condo-hoa-fl` | `board-director-certification`, `-2`, `-6` |
| Board Continuing Education | `/board-members-continuing-education` | `board-continuing-education` + `board-ce-condo-1/2/3-plus`, `board-ce-hoa-1/2/3-plus`, `board-ce-coop-1` |

**Resources** (all prose in code except the last two)

`/how-to-get-real-estate-license-in-florida` · `/how-get-cam-license-florida` ·
`/florida-real-estate-exam` · `/real-estate-license-florida-cost` ·
`/florida-cam-license-cost` · `/florida-real-estate-agent-income-benefits` ·
`/blog` *(DB)* · `/#about-us` · `/reviews` *(DB)*

### 2.2 Storefront shelves

`/store/real-estate-continuing-education` — bundle + 4 topics
`/store/cam-continuing-education` — bundle + 5 topics

### 2.3 Commerce and account

`/courses` · `/courses/[slug]` · `/cart` · `/checkout` · `/checkout/success` ·
`/login`

`/dashboard` · `/dashboard/courses/[courseId]` ·
`/dashboard/courses/[courseId]/exam` · `/dashboard/certificates` ·
`/dashboard/certificates/[enrollmentId]` · `/dashboard/orders` ·
`/dashboard/messages` · `/dashboard/settings`

### 2.4 Forms that write to the DB

| Route | Writes |
| --- | --- |
| `/contact` | `contact_messages` |
| `/returns-refunds` | `contact_messages` with `subject = "Refund request"`, body carries order number + date |

### 2.5 Legal and misc

`/privacy` · `/terms` · `/sms-terms` · `/returns-refunds` (policy section) — all
prose in code.

### 2.6 Admin routes that already exist

`/admin` · `/admin/courses` · `/admin/courses/[courseId]` · `/admin/blog` ·
`/admin/orders` · `/admin/messages` · `/admin/questions` · `/admin/reviews`

**Extend these. Do not build a parallel admin.**

---

## 3. Supabase schema

Types live in `src/lib/database.types.ts`. Enums:

```ts
UserRole      = "student" | "instructor" | "admin"
TrackSlug     = "real-estate" | "cam" | "board-members"
OfferingType  = "licensing" | "post_licensing" | "exam_prep"
              | "continuing_education" | "course_extension" | "certification"
OrderStatus   = "pending" | "paid" | "failed" | "refunded" | "canceled"
LessonKind    = "video" | "text" | "quiz" | "download"
```

| Table | Columns | Rows today |
| --- | --- | --- |
| `tracks` | id, slug, name, tagline, icon, accent_color, sort_order | 3 |
| `courses` | id, track_id, offering_type, slug, title, subtitle, description, hours, price_cents, is_state_approved, passing_exam_score, access_days, is_published, is_listed, sort_order, created_at, updated_at | 45 |
| `course_modules` | id, course_id, title, sort_order | — |
| `lessons` | id, module_id, title, kind, content, duration_minutes, sort_order | — |
| `blog_posts` | id, slug, title, excerpt, cover_image_url, body_markdown, author_id, published_at, category, created_at | 29 |
| `reviews` | id, user_id, course_id, rating, body, is_published, created_at | 0 |
| `contact_messages` | id, name, email, phone, subject, body, handled, created_at | 0 |
| `orders` | id, user_id, status, total_cents, stripe_session_id, coupon_code, created_at, updated_at | 0 |
| `order_items` | id, order_id, course_id, unit_price_cents, quantity | 0 |
| `enrollments` | id, user_id, course_id, order_id, enrolled_at, access_expires_at, completed_at, certificate_number | 0 |
| `lesson_progress` | id, enrollment_id, lesson_id, completed_at | 0 |
| `exam_questions` | id, course_id, question, choices[], correct_index, explanation | 0 |
| `exam_attempts` | id, enrollment_id, score_percent, passed, answers, taken_at | 0 |
| `messages` | id, enrollment_id, sender_id, body, created_at | 0 |
| `coupons` | code, percent_off, amount_off_cents, active, expires_at | 0 |
| `profiles` | id, full_name, phone, role, email_opt_in, created_at, updated_at | 0 |

---

## 4. Pricing rules — read before touching a price

### 4.1 One number, two meanings

`courses.price_cents` is the only stored price. Whether it is a **list** price
or a **payable** price depends on which discount system the slug belongs to.

**A. Promotional courses** — slugs listed in `PROMO.slugs`
(`src/lib/promo.ts`): the row holds the **LIST** price and checkout takes
`PROMO.percentOff` (30%) off it.

```
re-63-sales-associate            re-63-sales-associate-basic
re-63-sales-associate-premium    re-63-sales-associate-ultimate
re-mutual-recognition-exam-prep  cam-licensing-course
cam-licensing-course-basic       cam-licensing-course-premium
cam-licensing-course-ultimate
```

Storing the already-discounted figure here **double-discounts it**. Example:
Premium holds `25000` and sells at `$175.00`.

`PROMO.finalCents` overrides the arithmetic where the advertised cut is not
exactly 30% (`re-mutual-recognition-exam-prep`: 14200 → charged 9900).

**B. Everything else**: the row holds the **PAYABLE** price. Where the site
advertises a struck-through anchor, that anchor is display-only and lives in
`LIST_PRICES` (`src/lib/promo.ts`), e.g.

```
re-sales-associate-exam-prep 11700   ($117 → $67)
cam-exam-prep                11900   ($119 → $69)
cam-continuing-education     14200   ($142 → $99)
re-72-broker                 27900   ($279 → $229)
re-45-sales-associate-post   15600   ($156 → $109)
re-continuing-education       3500   ($35  → $24)
```

`listPriceCents()` refuses to stack the two systems: a promoted slug never
also shows a `LIST_PRICES` anchor.

**If the admin panel is to edit anchors too**, move `LIST_PRICES` into a
`courses.list_price_cents` column and read it in `src/lib/promo.ts`. Until
then, anchors are code and the panel must not pretend otherwise.

### 4.2 Visibility flags

- `is_published` — can it be bought? `priceCart` rejects unpublished rows.
- `is_listed` — does it appear in `/courses` and track pages?

Tier, seat-count and per-topic variants are `is_published = true,
is_listed = false`: purchasable, but sold from their landing page rather than
listed as near-duplicate catalog tiles.

### 4.3 Slugs are contracts

Landing pages resolve products **by slug**, e.g.
`/board-certification-condo-hoa-fl` looks up `board-director-certification-2`.
Rename a slug and the page silently falls back to its base course — same page,
wrong price. Treat slug edits as a migration: update the page constant in the
same change.

### 4.4 Caching

`/courses/[slug]` sets `export const revalidate = 3600`. In production a price
edit can take up to an hour to appear there. Landing pages are dynamic (they
await Supabase per request). If the panel needs instant reflection, either drop
that constant to 60 or call `revalidatePath()` after a write.

### 4.5 Known data bug

`re-63-sales-associate` (18900) and `re-63-sales-associate-basic` (10000)
should both be **16600** — the $166 list price that the 30% promo turns into
the advertised $116.20. Today Basic renders as `$100 → $70`. Fix ready at
`supabase/fix_63_hour_basic_price.sql`.

---

## 5. Suggested admin sidebar

```
Catalog
  Tracks                     tracks (3)
  Courses                    courses (45), filter by track + offering_type
    ├─ Listed products       is_listed = true
    └─ Variants              is_listed = false  (tiers, seats, topics)
  Modules & lessons          course_modules, lessons
Content
  Blog posts                 blog_posts (29) — markdown body, cover, category
  Reviews                    reviews — moderation queue (is_published)
Commerce
  Orders                     orders + order_items, status filter
  Enrollments                enrollments, access_expires_at, certificates
  Coupons                    coupons — percent_off / amount_off_cents
Inbox
  Contact messages           contact_messages where subject is null
  Refund requests            contact_messages where subject = 'Refund request'
Exams
  Question bank              exam_questions by course
  Attempts                   exam_attempts, pass rates
Users
  Profiles                   profiles, role = student | instructor | admin
```

---

## 6. Non-negotiables

1. **Never store a formatted price.** `price_cents` integer only; the site
   formats it.
2. **Respect the promo/list split** in §4.1. A price editor should show which
   system a slug is in and preview the post-promo figure before saving.
3. **Writes need the service role.** `SUPABASE_SERVICE_ROLE_KEY` is currently
   unset in `.env.local`; admin mutations that bypass RLS will fail until it
   is. Never expose it to the browser.
4. **Deleting a course breaks pages.** Landing pages reference slugs directly;
   prefer `is_published = false` to deletion.
5. **RLS is on.** `courses`, `tracks` and `blog_posts` are publicly readable
   with the anon key; the rest are policy-gated. Do not disable RLS to make a
   write work — add a policy or use the service role.

---

## 7. Environment

```
NEXT_PUBLIC_SUPABASE_URL          set
NEXT_PUBLIC_SUPABASE_ANON_KEY     set
SUPABASE_SERVICE_ROLE_KEY         EMPTY — required for admin writes and Stripe fulfilment
STRIPE_SECRET_KEY                 empty — checkout runs in test/bypass mode
STRIPE_WEBHOOK_SECRET             empty
CONTACT_NOTIFY_WEBHOOK            optional — contact form email relay
GOOGLE_PLACES_API_KEY             optional — live Google reviews
```
