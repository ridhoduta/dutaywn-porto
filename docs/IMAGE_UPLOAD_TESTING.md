# Image Upload Testing Checklist

After setting up Supabase Storage buckets and RLS policies, test the upload functionality:

## Pre-Testing Setup
- [ ] Created 3 storage buckets in Supabase: `profiles`, `projects`, `certifications`
- [ ] Marked all buckets as **Public**
- [ ] Ran `supabase/storage-setup.sql` in Supabase SQL Editor
- [ ] Verified policies exist (Storage → Bucket → Policies tab)

## Testing Profile Image Upload

1. [ ] Navigate to `/admin/profile`
2. [ ] Click the "📤 Click to upload image" button
3. [ ] Select an image file (JPG/PNG/WEBP, < 5MB)
4. [ ] Verify image preview appears
5. [ ] Verify upload completes without errors
6. [ ] Click "Save Profile" button
7. [ ] Refresh page - image should persist
8. [ ] Click the "✕" button on preview to remove image
9. [ ] Upload a different image (should replace the old one)

## Testing Certification Image Upload

1. [ ] Navigate to `/admin/certifications`
2. [ ] Click "➕ Add Certification"
3. [ ] Fill in required fields
4. [ ] Click upload area for "Certification Badge/Image"
5. [ ] Select an image file
6. [ ] Verify preview appears
7. [ ] Click "Create Certification"
8. [ ] Verify certification saved with image
9. [ ] Edit the certification
10. [ ] Upload a different image
11. [ ] Verify old image is replaced

## Testing Project Image Upload

1. [ ] Navigate to `/admin/projects`
2. [ ] Click "➕ Add Project"
3. [ ] Fill in required fields
4. [ ] Click upload area for "Project Image"
5. [ ] Select an image file
6. [ ] Verify preview appears
7. [ ] Click "Create Project"
8. [ ] Verify project saved with image
9. [ ] View project on public site (if available)
10. [ ] Verify image displays correctly

## Error Handling Tests

### File Size Validation
- [ ] Try uploading file > 5MB - should show error message
- [ ] Error message should be clear and helpful

### File Type Validation
- [ ] Try uploading PDF - should show error
- [ ] Try uploading .txt file - should show error
- [ ] Error should list allowed types

### Network Error Handling
- [ ] Disconnect internet
- [ ] Try uploading - should show error
- [ ] Reconnect and retry - should work

## Public Access Tests

1. [ ] Log out of admin panel
2. [ ] Visit public portfolio page
3. [ ] Verify uploaded images display correctly
4. [ ] Check browser console for no CORS errors
5. [ ] Verify image URLs are accessible

## Cleanup Tests

1. [ ] Upload an image
2. [ ] Remove it using the "✕" button
3. [ ] Save the form
4. [ ] Verify image field is cleared
5. [ ] Edit again and upload new image

## Performance

- [ ] Upload completes in reasonable time (< 5 seconds for typical image)
- [ ] Loading spinner displays during upload
- [ ] Form is disabled during upload (prevents double submission)
- [ ] No console errors during upload

## Troubleshooting

If tests fail, check:

1. **RLS Policy Error**: Run SQL script again
2. **Bucket Not Found**: Create buckets in Supabase Dashboard
3. **CORS Error**: Ensure buckets are marked as Public
4. **Auth Error**: Verify you're logged into admin panel
5. **File Too Large**: Check file size < 5MB

## Notes

- Images are stored in Supabase Storage, not the database
- Database stores only the public URL
- Old images are automatically deleted when replaced
- All uploads require authentication

---

✅ All tests passed? You're ready to go!
