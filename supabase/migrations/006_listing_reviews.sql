-- Listing reviews
CREATE TABLE listing_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  author_name TEXT,
  author_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listing_reviews_listing ON listing_reviews(listing_id);
CREATE INDEX idx_listing_reviews_status ON listing_reviews(status);

ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved reviews" ON listing_reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert review" ON listing_reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access reviews" ON listing_reviews
  FOR ALL USING (auth.role() = 'service_role');
