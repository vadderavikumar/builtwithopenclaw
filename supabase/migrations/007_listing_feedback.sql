-- Listing feedback (Was this helpful?)
CREATE TABLE listing_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  helpful BOOLEAN NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, fingerprint)
);

CREATE INDEX idx_listing_feedback_listing ON listing_feedback(listing_id);

ALTER TABLE listing_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback" ON listing_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access feedback" ON listing_feedback
  FOR ALL USING (auth.role() = 'service_role');
