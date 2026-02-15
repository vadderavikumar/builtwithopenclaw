-- Blog featured slots (5 per week, $29)
CREATE TABLE blog_featured_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start_date DATE NOT NULL,
  slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 5),
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_start_date, slot_number)
);

CREATE INDEX idx_blog_featured_slots_week ON blog_featured_slots(week_start_date);

-- Add product_type to purchases (homepage vs blog)
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'homepage';

-- RLS for blog_featured_slots
ALTER TABLE blog_featured_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blog featured" ON blog_featured_slots
  FOR SELECT USING (true);

CREATE POLICY "Service role full access blog featured" ON blog_featured_slots
  FOR ALL USING (auth.role() = 'service_role');
