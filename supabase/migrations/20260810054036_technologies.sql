-- Create technologies table
CREATE TABLE IF NOT EXISTS technologies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX idx_technologies_name ON technologies(name);

-- Enable Row Level Security
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access on technologies"
  ON technologies
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert technologies"
  ON technologies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update technologies"
  ON technologies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete technologies"
  ON technologies
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE technologies IS 'Stores technologies used in projects';
