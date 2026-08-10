-- Quick Setup Script for Supabase Storage
-- Run this in Supabase Dashboard → SQL Editor

-- First, create the buckets (if they don't exist)
-- You can also create these via Dashboard → Storage → New bucket
-- Make sure to mark them as "Public" when creating

-- Enable RLS on storage.objects (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ======================
-- PROFILES BUCKET POLICIES
-- ======================

CREATE POLICY "Public read access for profiles"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

CREATE POLICY "Authenticated users can upload to profiles"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update profiles"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete from profiles"
ON storage.objects FOR DELETE
USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');

-- ======================
-- PROJECTS BUCKET POLICIES
-- ======================

CREATE POLICY "Public read access for projects"
ON storage.objects FOR SELECT
USING (bucket_id = 'projects');

CREATE POLICY "Authenticated users can upload to projects"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects"
ON storage.objects FOR UPDATE
USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete from projects"
ON storage.objects FOR DELETE
USING (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- ======================
-- CERTIFICATIONS BUCKET POLICIES
-- ======================

CREATE POLICY "Public read access for certifications"
ON storage.objects FOR SELECT
USING (bucket_id = 'certifications');

CREATE POLICY "Authenticated users can upload to certifications"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certifications' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update certifications"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certifications' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete from certifications"
ON storage.objects FOR DELETE
USING (bucket_id = 'certifications' AND auth.role() = 'authenticated');
