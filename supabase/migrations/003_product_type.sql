-- Add product_type to listings and submissions
-- Distinguishes: Application, Plugin, Skill, Extension

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'Application'
  CHECK (product_type IN ('Application', 'Plugin', 'Skill', 'Extension'));

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'Application'
  CHECK (product_type IN ('Application', 'Plugin', 'Skill', 'Extension'));

CREATE INDEX IF NOT EXISTS idx_listings_product_type ON listings(product_type);
