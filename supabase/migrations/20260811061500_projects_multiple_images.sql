-- Add new column
ALTER TABLE projects ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- Migrate existing data
UPDATE projects 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Drop old column
ALTER TABLE projects DROP COLUMN image_url;
