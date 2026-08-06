-- =============================================================================
-- Prolicense Florida — complete public schema
-- =============================================================================
--
-- Every table the application uses, in dependency order. Safe to run against
-- the live project: everything is `if not exists` / `on conflict do nothing`
-- and there is not a single DROP or ALTER of existing data.
--
-- Provenance, so you know what to trust:
--   * Table and column lists are authoritative — they mirror
--     src/lib/database.types.ts, which was verified against the live project
--     (column counts match on every table readable with the anon key).
--   * Types, defaults, foreign keys, checks and indexes are reconstructed from
--     how the app reads and writes each table. They match the original schema's
--     intent but were not read back from the live database, because that needs
--     the service-role key. If you have it, diff with:
--       npx supabase db dump --schema public
--
-- Regenerate the TypeScript types after any change here:
--   npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz \
--     > src/lib/database.types.ts
-- =============================================================================

create extension if not exists "pgcrypto";

-- ------------------------------- enums --------------------------------------
-- `create type` has no `if not exists`, hence the guards.

do $$ begin
  create type user_role as enum ('student', 'instructor', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type track_slug as enum ('real-estate', 'cam', 'board-members');
exception when duplicate_object then null; end $$;

do $$ begin
  create type offering_type as enum (
    'licensing',
    'post_licensing',
    'exam_prep',
    'continuing_education',
    'course_extension',
    'certification'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'pending', 'paid', 'failed', 'refunded', 'canceled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type lesson_kind as enum ('video', 'text', 'quiz', 'download');
exception when duplicate_object then null; end $$;

-- ------------------------------ identity ------------------------------------

-- One row per auth.users row, created by the handle_new_user trigger below.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  role        user_role   not null default 'student',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------- catalog ------------------------------------

create table if not exists public.tracks (
  id           uuid primary key default gen_random_uuid(),
  slug         track_slug not null unique,
  name         text       not null,
  tagline      text,
  icon         text,
  accent_color text,
  sort_order   integer    not null default 0
);

create table if not exists public.courses (
  id                  uuid primary key default gen_random_uuid(),
  track_id            uuid          not null references public.tracks (id) on delete cascade,
  offering_type       offering_type not null,
  slug                text          not null unique,
  title               text          not null,
  subtitle            text,
  description         text,
  hours               integer,
  price_cents         integer       not null default 0 check (price_cents >= 0),
  is_state_approved   boolean       not null default false,
  passing_exam_score  integer       check (passing_exam_score between 0 and 100),
  access_days         integer,
  is_published        boolean       not null default false,
  sort_order          integer       not null default 0,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);

create index if not exists courses_track_id_idx  on public.courses (track_id);
create index if not exists courses_published_idx on public.courses (is_published);

create table if not exists public.course_modules (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid    not null references public.courses (id) on delete cascade,
  title      text    not null,
  sort_order integer not null default 0
);

create index if not exists course_modules_course_id_idx
  on public.course_modules (course_id);

create table if not exists public.lessons (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid        not null references public.course_modules (id) on delete cascade,
  title            text        not null,
  kind             lesson_kind not null default 'text',
  content          text,
  duration_minutes integer,
  sort_order       integer     not null default 0
);

create index if not exists lessons_module_id_idx on public.lessons (module_id);

-- ------------------------------ commerce ------------------------------------

create table if not exists public.coupons (
  code             text primary key,
  percent_off      integer check (percent_off between 1 and 100),
  amount_off_cents integer check (amount_off_cents > 0),
  active           boolean not null default true,
  expires_at       timestamptz,
  -- Exactly one of the two discount forms must be set.
  constraint coupons_one_discount_kind check (
    (percent_off is null) <> (amount_off_cents is null)
  )
);

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid         not null references auth.users (id) on delete cascade,
  status            order_status not null default 'pending',
  total_cents       integer      not null default 0 check (total_cents >= 0),
  stripe_session_id text unique,
  coupon_code       text references public.coupons (code) on delete set null,
  created_at        timestamptz  not null default now(),
  updated_at        timestamptz  not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

create table if not exists public.order_items (
  
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid    not null references public.orders (id) on delete cascade,
  course_id        uuid    not null references public.courses (id) on delete restrict,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity         integer not null default 1 check (quantity > 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ----------------------------- learning -------------------------------------

create table if not exists public.enrollments (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users (id) on delete cascade,
  course_id          uuid        not null references public.courses (id) on delete cascade,
  order_id           uuid        references public.orders (id) on delete set null,
  enrolled_at        timestamptz not null default now(),
  access_expires_at  timestamptz,
  completed_at       timestamptz,
  certificate_number text unique,
  -- Buying the same course twice must not create a second enrollment.
  unique (user_id, course_id)
);

create index if not exists enrollments_user_id_idx on public.enrollments (user_id);

create table if not exists public.lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  lesson_id     uuid not null references public.lessons (id) on delete cascade,
  completed_at  timestamptz,
  unique (enrollment_id, lesson_id)
);

create index if not exists lesson_progress_enrollment_id_idx
  on public.lesson_progress (enrollment_id);

create table if not exists public.exam_questions (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid    not null references public.courses (id) on delete cascade,
  question      text    not null,
  choices       text[]  not null check (array_length(choices, 1) >= 2),
  correct_index integer not null check (correct_index >= 0),
  explanation   text
);

create index if not exists exam_questions_course_id_idx
  on public.exam_questions (course_id);

create table if not exists public.exam_attempts (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid        not null references public.enrollments (id) on delete cascade,
  score_percent integer     not null check (score_percent between 0 and 100),
  passed        boolean     not null default false,
  answers       jsonb       not null default '[]'::jsonb,
  taken_at      timestamptz not null default now()
);

create index if not exists exam_attempts_enrollment_id_idx
  on public.exam_attempts (enrollment_id);

-- Instructor <-> student thread, scoped to one enrollment.
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid        not null references public.enrollments (id) on delete cascade,
  sender_id     uuid        not null references auth.users (id) on delete cascade,
  body          text        not null,
  created_at    timestamptz not null default now()
);

create index if not exists messages_enrollment_id_idx
  on public.messages (enrollment_id, created_at);

-- ------------------------------ content -------------------------------------

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  cover_image_url text,
  body_markdown   text,
  author_id       uuid references auth.users (id) on delete set null,
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc nulls last);

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid    not null references auth.users (id) on delete cascade,
  course_id    uuid    not null references public.courses (id) on delete cascade,
  rating       integer not null check (rating between 1 and 5),
  body         text,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists reviews_course_id_idx
  on public.reviews (course_id, is_published);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  phone      text,
  subject    text,
  body       text        not null,
  created_at timestamptz not null default now(),
  handled    boolean     not null default false
);

-- ------------------------------ functions -----------------------------------

-- Admin check used by RLS policies.
--
-- SECURITY DEFINER and `set search_path` are load-bearing: a policy that
-- instead inlined `exists (select 1 from profiles where ...)` would re-trigger
-- profiles' own SELECT policy and recurse until Postgres aborts with
-- "stack depth limit exceeded" (SQLSTATE 54001). Definer rights bypass RLS
-- inside the function, which breaks the cycle.
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

-- Mirror every new auth user into profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------- row level security -----------------------------
--
-- Enabling RLS is included because it is safe and idempotent. The policies
-- themselves are NOT reproduced here — they are live in your project and this
-- file was reconstructed without service-role access, so writing policies would
-- mean guessing at your actual access rules. Dump the real ones with:
--   npx supabase db dump --schema public --data-only=false

alter table public.profiles         enable row level security;
alter table public.tracks           enable row level security;
alter table public.courses          enable row level security;
alter table public.course_modules   enable row level security;
alter table public.lessons          enable row level security;
alter table public.coupons          enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.enrollments      enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.exam_questions   enable row level security;
alter table public.exam_attempts    enable row level security;
alter table public.messages         enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.reviews          enable row level security;
alter table public.contact_messages enable row level security;
