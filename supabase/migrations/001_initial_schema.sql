-- BuiltWithOpenClaw Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Submissions: incoming free listings (pending review)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pricing_type TEXT NOT NULL,
  hosting_type TEXT NOT NULL,
  github_url TEXT,
  contact_email TEXT NOT NULL,
  logo_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  openclaw_proof TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  honeypot TEXT
);

-- Listings: approved, published listings
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pricing_type TEXT NOT NULL,
  hosting_type TEXT NOT NULL,
  github_url TEXT,
  logo_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'unlisted')),
  verified BOOLEAN DEFAULT FALSE,
  claimed_by TEXT,
  openclaw_proof TEXT
);

CREATE INDEX idx_listings_slug ON listings(slug);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_published_at ON listings(published_at DESC);

-- Featured slots (10 per week)
CREATE TABLE featured_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL,
  slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 10),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_start_date, slot_number)
);

CREATE INDEX idx_featured_slots_week ON featured_slots(week_start_date);

-- Purchases (Stripe)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'refunded')),
  week_start_date DATE,
  slot_number INTEGER,
  listing_id UUID REFERENCES listings(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing claims
CREATE TABLE listing_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  verification_token TEXT NOT NULL UNIQUE,
  verified_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing upvotes
CREATE TABLE listing_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, fingerprint)
);

CREATE INDEX idx_listing_upvotes_listing ON listing_upvotes(listing_id);

-- Listing reports
CREATE TABLE listing_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  listing_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Listings: public read for published, service role has full access
CREATE POLICY "Public can read published listings" ON listings
  FOR SELECT USING (status = 'published');

-- Submissions, featured_slots, purchases: admin only (via service role)
CREATE POLICY "Service role full access submissions" ON submissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access featured_slots" ON featured_slots
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access purchases" ON purchases
  FOR ALL USING (auth.role() = 'service_role');

-- Listing claims: anon can insert, service role full
CREATE POLICY "Anyone can insert claim" ON listing_claims
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access claims" ON listing_claims
  FOR ALL USING (auth.role() = 'service_role');

-- Listing upvotes: anon can insert (rate limited in app)
CREATE POLICY "Anyone can insert upvote" ON listing_upvotes
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read upvotes" ON listing_upvotes
  FOR SELECT USING (true);

-- Listing reports: anon can insert
CREATE POLICY "Anyone can insert report" ON listing_reports
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access reports" ON listing_reports
  FOR ALL USING (auth.role() = 'service_role');

-- Collections: public read
CREATE POLICY "Public can read collections" ON collections
  FOR SELECT USING (true);
CREATE POLICY "Service role full access collections" ON collections
  FOR ALL USING (auth.role() = 'service_role');

-- Newsletter: anon can insert
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role full access newsletter" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');
