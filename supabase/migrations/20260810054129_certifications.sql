-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  credential_url TEXT,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on issue_date for sorting
CREATE INDEX idx_certifications_issue_date ON certifications(issue_date DESC);

-- Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access on certifications"
  ON certifications
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update certifications"
  ON certifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete certifications"
  ON certifications
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE certifications IS 'Stores professional certifications';
