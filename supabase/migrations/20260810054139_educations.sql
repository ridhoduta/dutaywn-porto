-- Create educations table
CREATE TABLE IF NOT EXISTS educations (
  id BIGSERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on display_order for sorting
CREATE INDEX idx_educations_display_order ON educations(display_order);

-- Create index on start_date for sorting
CREATE INDEX idx_educations_start_date ON educations(start_date DESC);

-- Enable Row Level Security
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access on educations"
  ON educations
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert educations"
  ON educations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update educations"
  ON educations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete educations"
  ON educations
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE educations IS 'Stores educational background';
