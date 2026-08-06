# Florida Licensing Academy

Online school for Florida licensing education — real estate, community
association manager (CAM) and HOA/condo board member certification.

Replaces the old multi-login Wix setup with **one account**: a single login, a
real course player, a real cart and checkout, and one dashboard holding every
course, exam attempt and certificate a student owns.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase
(Postgres + Auth + RLS) · Stripe · deploys to Vercel.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the values below
npm run dev                    # http://localhost:3000
```

`.env.local` is already populated with the Supabase URL and anon key for the
connected project. Fill in the rest as you get them.

### Environment variables

| Variable | Required | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL. Already set. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public anon key. Already set. |
| `SUPABASE_SERVICE_ROLE_KEY` | **strongly recommended** | Bypasses RLS. Required for the Stripe webhook, coupon lookups and full admin writes. See below. |
| `STRIPE_SECRET_KEY` | no | Leave blank to use the built-in dev checkout. |
| `STRIPE_WEBHOOK_SECRET` | no | Needed only when Stripe is live. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | no | Reserved for future embedded payment elements. |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | Absolute base URL. Used for OG tags, sitemap and Stripe redirects. |
| `CONTACT_NOTIFY_WEBHOOK` | no | POST endpoint that emails staff when the contact form is submitted. Without it messages are still saved and visible in `/admin/messages`. |

---

## Database

The schema in `supabase_schema.sql` is already applied to the connected project,
and tracks, courses, modules, lessons and blog posts are seeded.

Two tables were empty, which left the exam-prep feature and the checkout coupon
field with nothing to show. Run this once in the Supabase SQL editor to fill
them (it is idempotent):

```
supabase/seed_exam_questions_and_coupons.sql
```

It adds ~26 Florida-specific exam questions across the real estate, CAM and
board tracks, plus three coupon codes (`WELCOME10`, `SAVE25`, `FLASH20`).

### Regenerating types

`src/lib/database.types.ts` is hand-maintained to match the schema. After a
schema change, regenerate it:

```bash
npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz > src/lib/database.types.ts
```

---

## Things to do before launch

These are live and worth handling in order.

### 1. Email confirmation is currently ON

Signing up returns "check your inbox" rather than an immediate session. That is
correct behaviour, but it means students cannot start a course until they click
the confirmation link, and you cannot test the purchase flow end to end without
a real inbox.

- To test faster: Supabase → **Authentication → Providers → Email** → turn off
  *Confirm email*.
- To keep it on for production (recommended): configure **Authentication → URL
  Configuration → Redirect URLs** to include
  `https://yourdomain.com/auth/callback`, and set up SMTP so confirmation mail
  actually lands.

### 2. Set the service role key

Without `SUPABASE_SERVICE_ROLE_KEY`:

- the Stripe webhook cannot create enrollments (there is no user session in a
  webhook, so RLS blocks the write),
- coupon codes cannot be validated (`coupons` is admin-read-only under RLS),
- admin writes fall back to your own session and are limited to what the RLS
  policies allow.

The app degrades gracefully and says so — the admin area shows a banner and
checkout shows a test-mode notice — but it is required for real payments.

### 3. Make yourself an admin

The signup trigger creates every profile as `student`. Promote your account in
the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@yourdomain.com');
```

Then `/admin` unlocks in the nav.

### 4. Verify the profile trigger fired

Every `auth.users` row should have a matching `public.profiles` row. Check after
your first signup:

```sql
select u.email, p.role
from auth.users u
left join public.profiles p on p.id = u.id;
```

If `role` is null, the `on_auth_user_created` trigger did not run — re-run that
section of `supabase_schema.sql`.

### 5. Google OAuth

Login and signup both offer "Continue with Google". Enable it in Supabase →
**Authentication → Providers → Google** and add
`https://yourdomain.com/auth/callback` as an authorised redirect. Until then the
button will error.

### 6. Stripe

```bash
# local webhook testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Add the printed signing secret as `STRIPE_WEBHOOK_SECRET`. In production, point
a Stripe webhook endpoint at `https://yourdomain.com/api/webhooks/stripe` and
subscribe to `checkout.session.completed`, `checkout.session.expired` and
`charge.refunded`.

**Until `STRIPE_SECRET_KEY` is set, checkout runs in dev mode:** the order is
created, marked paid, and the enrollment issued immediately with no payment
taken. The checkout page says so plainly.

### 7. RLS note worth a decision

The supplied schema lets a signed-in user insert their own `enrollments` rows
(`enrollments_owner_or_admin ... for all ... with check (auth.uid() = user_id)`).
That is what makes the no-Stripe dev checkout work, but it also means a
technically capable user could self-enrol without paying by calling PostgREST
directly. Before launch, consider tightening that policy to insert-via-service-role
only, once the Stripe webhook is doing the fulfilment.

---

## Business rules — please confirm these with the client

Every one of these was an assumption made while building. They are all
adjustable, most from the admin area without a code change.

| Rule | Current behaviour | Where to change |
| --- | --- | --- |
| **Passing score** | 70% by default, read per-course from `courses.passing_exam_score` | Admin → Courses → edit course |
| **Certificate issue** | Requires **100% of lessons complete** *and* at least one passing exam attempt. A course with **zero** questions in its bank issues on lesson completion alone. | `maybeIssueCertificate()` in `src/app/dashboard/actions.ts` |
| **Certificate number** | `FLA-{RE\|CAM\|BRD}-{year}-{6 random chars}` | `generateCertificateNumber()` in `src/lib/fulfillment.ts` |
| **Access window** | `courses.access_days`, default 365, counted from purchase date | Admin → Courses |
| **Course extension** | Buying one creates an enrollment for the extension "course". The student then picks which enrollment to extend from their dashboard; it adds the extension's `access_days` to that course's expiry and consumes the extension. If access already lapsed, the new window starts today. | `applyExtension()` in `src/app/dashboard/actions.ts` |
| **Exam attempts** | Unlimited, all scored server-side and saved. Best score is what counts. | — |
| **Refund window** | 7 days, under 25% complete, no certificate issued | `src/app/returns-refunds/page.tsx` |
| **Reviews** | Only verified purchasers can leave one; unpublished until an admin approves | Admin → Reviews |
| **Coupon stacking** | One coupon per order; percentage or fixed amount, never both | `priceCart()` in `src/lib/fulfillment.ts` |
| **Duplicate purchase** | Checkout blocks buying a course you already own | `src/app/api/checkout/route.ts` |
| **Pricing & hours** | Taken from the seeded data as-is (63-hour SA at $199, CAM licensing at $249, etc.). **Confirm against the real price list.** | Admin → Courses |
| **Contact details** | Phone, email and address in `src/lib/site.ts` are placeholders | `src/lib/site.ts` |
| **Trust stats** | "20,000+ students licensed", "4.9/5", "10+ years" are placeholders | `src/lib/site.ts` |

---

## Project layout

```
src/
  app/
    page.tsx                          home
    real-estate|cam|board-members/    track landing pages
    courses/                          catalog + /courses/[slug] detail
    cart/ checkout/ checkout/success/ purchase flow
    (auth)/login|signup               unified auth (one login, no course picker)
    auth/callback|signout             OAuth + email confirm + logout
    dashboard/
      page.tsx                        my courses, progress, extension applier
      courses/[courseId]/             course player (sidebar, resume, auto-advance)
      courses/[courseId]/exam/        graded exam + flashcard mode
      certificates/                   list + printable certificate
      orders/ messages/ settings/
    admin/                            courses, curriculum, questions, blog,
                                      orders, reviews, contact inbox
    api/checkout, api/checkout/quote  order creation + coupon pricing
    api/webhooks/stripe               fulfilment
    sitemap.ts robots.ts
  components/
    ui/                               button, card, badge, input, alert, …
    layout/                           header w/ mega-menu, footer, user menu
    course/ marketing/ cart/
  lib/
    supabase/                         browser, server (RLS), service-role clients
    queries.ts enrollments.ts         data access
    fulfillment.ts                    pricing + order → enrollment
    auth.ts catalog.ts site.ts utils.ts
  proxy.ts                            session refresh + route protection
```

### Notable implementation choices

- **`src/proxy.ts`** is Next 16's replacement for `middleware.ts`. It refreshes
  the Supabase auth cookie on every request and redirects anonymous users away
  from `/dashboard`, `/admin` and `/checkout`.
- **Three Supabase clients.** `createClient()` respects RLS and is the default.
  `createPublicClient()` is cookie-free so catalog/blog queries do not force
  dynamic rendering on their own. `createServiceClient()` bypasses RLS and is
  used only by the webhook and verified admin writes.
- **Prices are never trusted from the client.** `priceCart()` re-reads every
  price from the database before an order is created.
- **Exams are graded server-side.** The client posts only
  `{question_id, selected_index}`; correct answers are compared on the server so
  a passing attempt cannot be forged.
- **Cart lives in `localStorage`** and syncs across tabs. Nothing touches the
  database until checkout.
- **Every page renders dynamically** because the header shows the signed-in
  user. Catalog and blog queries are React-cached per request and carry
  `revalidate` hints. If you want statically cached marketing pages later, the
  clean route is Next's `cacheComponents` with the header as a dynamic hole.

---

## Accessibility & SEO

- Skip-to-content link, visible focus rings, `aria-current` on active nav,
  labelled form fields, `role="alert"` on errors, `prefers-reduced-motion`
  respected.
- Semantic landmarks, one `h1` per page.
- Per-page `metadata` with canonicals and OpenGraph; `sitemap.xml` and
  `robots.txt` generated from live data; private routes are `noindex`.
- JSON-LD `Course` + `FAQPage` on course pages, `BlogPosting` on articles.

---

## Deploying to Vercel

1. Push the repo and import it in Vercel.
2. Add every variable from `.env.local` to Vercel's environment settings, with
   `NEXT_PUBLIC_SITE_URL` set to the production domain.
3. In Supabase → Authentication → URL Configuration, add the production
   `/auth/callback` URL.
4. Add the production Stripe webhook endpoint and paste its signing secret.

---

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build (also runs the TypeScript check)
npm start        # serve the production build
npm run lint     # eslint
npx tsc --noEmit # type check only
```
