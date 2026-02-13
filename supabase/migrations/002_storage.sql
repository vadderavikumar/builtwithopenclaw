-- Storage bucket for listing assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'listings');

-- Allow authenticated uploads (we use service role for uploads from API)
CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listings');
