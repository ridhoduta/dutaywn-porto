-- Create project_technologies junction table
CREATE TABLE IF NOT EXISTS project_technologies (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL,
  technology_id BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key constraints with cascade delete
  CONSTRAINT fk_project_technologies_project
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_project_technologies_technology
    FOREIGN KEY (technology_id)
    REFERENCES technologies(id)
    ON DELETE CASCADE,

  -- Ensure unique combinations
  CONSTRAINT unique_project_technology
    UNIQUE (project_id, technology_id)
);

-- Create indexes for faster joins
CREATE INDEX idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology_id ON project_technologies(technology_id);

-- Enable Row Level Security
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access on project_technologies"
  ON project_technologies
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert project_technologies"
  ON project_technologies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete project_technologies"
  ON project_technologies
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_technologies IS 'Junction table for many-to-many relationship between projects and technologies';
