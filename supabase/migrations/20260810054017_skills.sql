-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster filtering
CREATE INDEX idx_skills_category ON skills(category);

-- Create index on display_order for sorting
CREATE INDEX idx_skills_display_order ON skills(display_order);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access on skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert skills"
  ON skills
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update skills"
  ON skills
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete skills"
  ON skills
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE skills IS 'Stores technical skills with categories and display order';
