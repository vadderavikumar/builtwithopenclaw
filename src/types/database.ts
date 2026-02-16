export type Listing = {
  id: string;
  slug: string;
  created_at: string;
  published_at: string | null;
  updated_at: string | null;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: string;
  product_type: "Application" | "Plugin" | "Skill" | "Extension";
  tags: string[];
  pricing_type: string;
  hosting_type: string;
  github_url: string | null;
  logo_url: string | null;
  screenshots: string[];
  status: "published" | "unlisted";
  verified: boolean;
  claimed_by: string | null;
  openclaw_proof: string | null;
};

export type Submission = {
  id: string;
  created_at: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: string;
  product_type: "Application" | "Plugin" | "Skill" | "Extension";
  tags: string[];
  pricing_type: string;
  hosting_type: string;
  github_url: string | null;
  contact_email: string;
  logo_url: string | null;
  screenshots: string[];
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  honeypot: string | null;
};

export type FeaturedSlot = {
  id: string;
  week_start_date: string;
  slot_number: number;
  listing_id: string | null;
  created_at: string;
};

export type Purchase = {
  id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  dodo_payment_id: string | null;
  email: string;
  amount: number;
  currency: string;
  status: "paid" | "refunded";
  week_start_date: string | null;
  slot_number: number | null;
  listing_id: string | null;
  requested_week_start: string | null;
  product_type: string | null;
  created_at: string;
};

export type ListingReview = {
  id: string;
  listing_id: string;
  author_name: string | null;
  author_email: string | null;
  rating: number;
  comment: string | null;
  status: "pending" | "approved";
  created_at: string;
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  listing_ids: string[];
  created_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  title: string;
  excerpt: string;
  content_html: string;
  author_name: string | null;
  cover_image_url: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  canonical_url: string | null;
  geo_region: string | null;
  geo_placename: string | null;
  schema_type: string;
  faq_jsonld: unknown | null;
  og_image_url: string | null;
  noindex: boolean;
  reading_time_minutes: number;
};
