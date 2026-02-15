-- Store which week the user requested when purchasing a featured slot
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS requested_week_start DATE;
