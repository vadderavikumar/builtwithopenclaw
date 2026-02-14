-- Add Dodo Payments columns to purchases table
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS dodo_payment_id TEXT UNIQUE;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS dodo_session_id TEXT;
