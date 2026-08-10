# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage buckets for handling image uploads in the admin panel.

## Required Storage Buckets

You need to create three storage buckets in your Supabase project:

1. **profiles** - for profile images
2. **projects** - for project images
3. **certifications** - for certification badges/images

## Setup Instructions

### Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket** button

For each bucket (profiles, projects, certifications):

1. **Bucket name**: Enter the bucket name (e.g., `profiles`)
2. **Public bucket**: Toggle **ON** (this allows public read access for displaying images on your portfolio)
3. Click **Create bucket**

Repeat for all three buckets.

### Step 2: Configure RLS Policies

After creating the buckets, you need to set up Row Level Security (RLS) policies to control who can upload, read, and delete files.

#### Option A: Using the Supabase Dashboard (Recommended for beginners)

For **each bucket** (profiles, projects, certifications):

1. Click on the bucket name in Storage
2. Click on **Policies** tab
3. Click **New policy**

Create the following policies:

##### Policy 1: Allow Public Read Access

- **Policy name**: `Public read access`
- **Allowed operation**: `SELECT`
- **Policy definition**: 
  ```sql
  true
  ```
- Click **Review** then **Save policy**

##### Policy 2: Allow Authenticated Users to Upload

- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  auth.role() = 'authenticated'
  ```
- Click **Review** then **Save policy**

##### Policy 3: Allow Authenticated Users to Update

- **Policy name**: `Authenticated users can update`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```sql
  auth.role() = 'authenticated'
  ```
- Click **Review** then **Save policy**

##### Policy 4: Allow Authenticated Users to Delete

- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  auth.role() = 'authenticated'
  ```
- Click **Review** then **Save policy**

#### Option B: Using SQL (Recommended for automation)

Run this SQL in the **SQL Editor** section of your Supabase Dashboard:

```sql
-- Enable RLS on storage.objects (should already be enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policies for 'profiles' bucket
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

-- Policies for 'projects' bucket
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

-- Policies for 'certifications' bucket
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
```

### Step 3: Verify Configuration

After setting up the buckets and policies:

1. Go to **Storage** in Supabase Dashboard
2. Click on each bucket
3. Verify that the bucket shows as **Public**
4. Click on **Policies** tab and verify all 4 policies exist for each bucket

### Step 4: Test Upload

1. Log in to your admin panel: `/admin/login`
2. Navigate to any section (Profile, Projects, or Certifications)
3. Try uploading an image
4. The upload should now work without RLS errors

## Security Notes

### Current Setup (Development/Personal Portfolio)

The current configuration allows:
- ✅ Anyone can **read** (view) uploaded images (needed for public portfolio)
- ✅ Only **authenticated users** can upload, update, or delete images
- ✅ All authenticated users have full access

This is suitable for:
- Personal portfolios with a single admin user
- Development environments
- Small teams

### Production Considerations

For production environments with multiple users, consider more restrictive policies:

#### Option 1: Admin-Only Access

Only allow users with specific roles to upload:

```sql
-- Replace the authenticated policies with admin-only policies
-- First, add a custom claim or use metadata to identify admins

CREATE POLICY "Only admins can upload to profiles"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.jwt() ->> 'role' = 'admin'
);

-- Repeat for other operations and buckets
```

#### Option 2: User-Specific Access

Allow users to only manage their own uploads:

```sql
-- Users can only upload files with paths starting with their user ID
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Repeat for other operations
```

## Troubleshooting

### Error: "new row violates row-level security policy"

**Solution**: The bucket exists but lacks the proper INSERT policy for authenticated users. Add the "Authenticated users can upload" policy.

### Error: "Bucket not found"

**Solution**: Create the bucket using Step 1 above.

### Images Upload but Don't Display

**Solution**: Ensure the bucket is marked as **Public** and has a SELECT policy allowing public read access.

### Error: "JWT expired" or "Invalid token"

**Solution**: 
1. Check that you're logged in to the admin panel
2. Verify your Supabase environment variables in `.env.local`
3. Try logging out and logging back in

## Additional Configuration

### File Size Limits

The current implementation limits uploads to 5MB. To change this:

1. Update `MAX_FILE_SIZE` in `src/lib/supabase/storage.ts`
2. Also configure Supabase bucket limits in Dashboard → Storage → Bucket Settings

### Allowed File Types

Currently allowed: JPG, JPEG, PNG, WEBP, GIF

To modify, edit `ALLOWED_IMAGE_TYPES` in `src/lib/supabase/storage.ts`

## Summary

After completing this setup:

1. ✅ Three storage buckets created (profiles, projects, certifications)
2. ✅ Public read access configured for displaying images
3. ✅ Authenticated upload/update/delete permissions configured
4. ✅ Admin panel can upload images without RLS errors
5. ✅ Images are publicly accessible for the portfolio site

Your image upload functionality should now work correctly! 🎉
