-- Migration: Add role, duration, platform, and team columns to projects table

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS platform TEXT,
  ADD COLUMN IF NOT EXISTS team TEXT;

-- Add comments for documentation
COMMENT ON COLUMN projects.role IS 'Role of the author in the project (e.g., Full-stack Developer)';
COMMENT ON COLUMN projects.duration IS 'Project timeline/duration (e.g., 3 months)';
COMMENT ON COLUMN projects.platform IS 'Target platform (e.g., Web, Mobile, Desktop)';
COMMENT ON COLUMN projects.team IS 'Team composition/size (e.g., Solo, 5 developers)';
