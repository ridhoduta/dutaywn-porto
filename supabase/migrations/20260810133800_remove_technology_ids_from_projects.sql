-- Remove the manually added technology_ids column from projects table
-- This column conflicts with the existing project_technologies junction table
ALTER TABLE projects DROP COLUMN IF EXISTS technology_ids;

-- Comment explaining the architecture
COMMENT ON TABLE project_technologies IS 'Junction table for many-to-many relationship between projects and technologies. Use this instead of a technology_ids column in projects.';
