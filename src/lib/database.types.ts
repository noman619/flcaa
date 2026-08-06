/**
 * Hand-maintained types mirroring supabase_schema.sql.
 * Regenerate with:
 *   npx supabase gen types typescript --project-id yyaaoycatnwalympbxkz > src/lib/database.types.ts
 */

export type UserRole = "student" | "instructor" | "admin";
export type TrackSlug = "real-estate" | "cam" | "board-members";
export type OfferingType =
  | "licensing"
  | "post_licensing"
  | "exam_prep"
  | "continuing_education"
  | "course_extension"
  | "certification";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "canceled";
export type LessonKind = "video" | "text" | "quiz" | "download";

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  /** Optional: added by supabase/add_email_opt_in.sql. */
  email_opt_in?: boolean;
  created_at: string;
  updated_at: string;
}

export type Track = {
  id: string;
  slug: TrackSlug;
  name: string;
  tagline: string | null;
  icon: string | null;
  accent_color: string | null;
  sort_order: number;
}

export type Course = {
  id: string;
  track_id: string;
  offering_type: OfferingType;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  hours: number | null;
  price_cents: number;
  is_state_approved: boolean;
  passing_exam_score: number | null;
  access_days: number | null;
  is_published: boolean;
  /** Optional: added by supabase/add_course_tiers.sql. Absent = listed. */
  is_listed?: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CourseModule = {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
}

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  kind: LessonKind;
  content: string | null;
  duration_minutes: number | null;
  sort_order: number;
}

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_cents: number;
  stripe_session_id: string | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderItem = {
  id: string;
  order_id: string;
  course_id: string;
  unit_price_cents: number;
  quantity: number;
}

export type Coupon = {
  code: string;
  percent_off: number | null;
  amount_off_cents: number | null;
  active: boolean;
  expires_at: string | null;
}

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  order_id: string | null;
  enrolled_at: string;
  access_expires_at: string | null;
  completed_at: string | null;
  certificate_number: string | null;
}

export type LessonProgress = {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  completed_at: string | null;
}

export type ExamQuestion = {
  id: string;
  course_id: string;
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string | null;
}

export type ExamAttempt = {
  id: string;
  enrollment_id: string;
  score_percent: number;
  passed: boolean;
  answers: Json;
  taken_at: string;
}

export type Message = {
  id: string;
  enrollment_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body_markdown: string | null;
  author_id: string | null;
  published_at: string | null;
  /** Optional: added by supabase/import_blog_posts.sql. */
  category?: string;
  created_at: string;
}

export type Review = {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  body: string | null;
  is_published: boolean;
  created_at: string;
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  body: string;
  created_at: string;
  handled: boolean;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  // supabase-js >= 2.100 reads this to pick its PostgREST inference rules.
  __InternalSupabase: { PostgrestVersion: "12" };
  public: {
    Tables: {
      profiles: Table<Profile>;
      tracks: Table<Track>;
      courses: Table<Course>;
      course_modules: Table<CourseModule>;
      lessons: Table<Lesson>;
      orders: Table<Order>;
      order_items: Table<OrderItem>;
      coupons: Table<Coupon>;
      enrollments: Table<Enrollment>;
      lesson_progress: Table<LessonProgress>;
      exam_questions: Table<ExamQuestion>;
      exam_attempts: Table<ExamAttempt>;
      messages: Table<Message>;
      blog_posts: Table<BlogPost>;
      reviews: Table<Review>;
      contact_messages: Table<ContactMessage>;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      track_slug: TrackSlug;
      offering_type: OfferingType;
      order_status: OrderStatus;
      lesson_kind: LessonKind;
    };
    CompositeTypes: { [_ in never]: never };
  };
}

