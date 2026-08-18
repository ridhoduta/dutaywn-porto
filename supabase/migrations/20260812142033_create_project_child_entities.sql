-- Create PROJECT_PROBLEMS table
CREATE TABLE IF NOT EXISTS project_problems (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_PROBLEMS
CREATE INDEX IF NOT EXISTS idx_project_problems_project_id ON project_problems(project_id);
CREATE INDEX IF NOT EXISTS idx_project_problems_sort_order ON project_problems(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_problems_project_id_sort_order ON project_problems(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_problems_created_at ON project_problems(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_PROBLEMS
CREATE TRIGGER update_project_problems_updated_at
  BEFORE UPDATE ON project_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_PROBLEMS
ALTER TABLE project_problems ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_PROBLEMS
CREATE POLICY "Allow public read access on project_problems"
  ON project_problems
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_problems"
  ON project_problems
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_problems"
  ON project_problems
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_problems"
  ON project_problems
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_problems IS 'Stores project challenges, blockers, and problems that needed solving';

---

-- Create PROJECT_SOLUTIONS table
CREATE TABLE IF NOT EXISTS project_solutions (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_SOLUTIONS
CREATE INDEX IF NOT EXISTS idx_project_solutions_project_id ON project_solutions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_solutions_sort_order ON project_solutions(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_solutions_project_id_sort_order ON project_solutions(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_solutions_created_at ON project_solutions(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_SOLUTIONS
CREATE TRIGGER update_project_solutions_updated_at
  BEFORE UPDATE ON project_solutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_SOLUTIONS
ALTER TABLE project_solutions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_SOLUTIONS
CREATE POLICY "Allow public read access on project_solutions"
  ON project_solutions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_solutions"
  ON project_solutions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_solutions"
  ON project_solutions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_solutions"
  ON project_solutions
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_solutions IS 'Stores how problems were addressed and solved';

---

-- Create PROJECT_DESIGNS table
CREATE TABLE IF NOT EXISTS project_designs (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_DESIGNS
CREATE INDEX IF NOT EXISTS idx_project_designs_project_id ON project_designs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_designs_sort_order ON project_designs(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_designs_project_id_sort_order ON project_designs(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_designs_created_at ON project_designs(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_DESIGNS
CREATE TRIGGER update_project_designs_updated_at
  BEFORE UPDATE ON project_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_DESIGNS
ALTER TABLE project_designs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_DESIGNS
CREATE POLICY "Allow public read access on project_designs"
  ON project_designs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_designs"
  ON project_designs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_designs"
  ON project_designs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_designs"
  ON project_designs
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_designs IS 'Stores design mockups, wireframes, prototypes, and visual design artifacts';

---

-- Create PROJECT_FEATURES table
CREATE TABLE IF NOT EXISTS project_features (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_FEATURES
CREATE INDEX IF NOT EXISTS idx_project_features_project_id ON project_features(project_id);
CREATE INDEX IF NOT EXISTS idx_project_features_sort_order ON project_features(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_features_project_id_sort_order ON project_features(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_features_created_at ON project_features(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_FEATURES
CREATE TRIGGER update_project_features_updated_at
  BEFORE UPDATE ON project_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_FEATURES
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_FEATURES
CREATE POLICY "Allow public read access on project_features"
  ON project_features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_features"
  ON project_features
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_features"
  ON project_features
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_features"
  ON project_features
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_features IS 'Enumerates key features built in the project with descriptions';

---

-- Create PROJECT_TESTINGS table
CREATE TABLE IF NOT EXISTS project_testings (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  test_case TEXT NOT NULL,
  expected_result TEXT NOT NULL,
  actual_result TEXT NOT NULL,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_TESTINGS
CREATE INDEX IF NOT EXISTS idx_project_testings_project_id ON project_testings(project_id);
CREATE INDEX IF NOT EXISTS idx_project_testings_sort_order ON project_testings(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_testings_project_id_sort_order ON project_testings(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_testings_created_at ON project_testings(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_TESTINGS
CREATE TRIGGER update_project_testings_updated_at
  BEFORE UPDATE ON project_testings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_TESTINGS
ALTER TABLE project_testings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_TESTINGS
CREATE POLICY "Allow public read access on project_testings"
  ON project_testings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_testings"
  ON project_testings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_testings"
  ON project_testings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_testings"
  ON project_testings
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_testings IS 'Documents test cases, expected vs actual results, and test status';

---

-- Create PROJECT_RESULTS table
CREATE TABLE IF NOT EXISTS project_results (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  metric_label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_RESULTS
CREATE INDEX IF NOT EXISTS idx_project_results_project_id ON project_results(project_id);
CREATE INDEX IF NOT EXISTS idx_project_results_sort_order ON project_results(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_results_project_id_sort_order ON project_results(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_results_created_at ON project_results(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_RESULTS
CREATE TRIGGER update_project_results_updated_at
  BEFORE UPDATE ON project_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_RESULTS
ALTER TABLE project_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_RESULTS
CREATE POLICY "Allow public read access on project_results"
  ON project_results
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_results"
  ON project_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_results"
  ON project_results
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_results"
  ON project_results
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_results IS 'Captures measurable outcomes, metrics, and project impact';

---

-- Create PROJECT_LEARNINGS table
CREATE TABLE IF NOT EXISTS project_learnings (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for PROJECT_LEARNINGS
CREATE INDEX IF NOT EXISTS idx_project_learnings_project_id ON project_learnings(project_id);
CREATE INDEX IF NOT EXISTS idx_project_learnings_sort_order ON project_learnings(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_learnings_project_id_sort_order ON project_learnings(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_learnings_created_at ON project_learnings(created_at DESC);

-- Add trigger to automatically update updated_at for PROJECT_LEARNINGS
CREATE TRIGGER update_project_learnings_updated_at
  BEFORE UPDATE ON project_learnings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on PROJECT_LEARNINGS
ALTER TABLE project_learnings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for PROJECT_LEARNINGS
CREATE POLICY "Allow public read access on project_learnings"
  ON project_learnings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert project_learnings"
  ON project_learnings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_learnings"
  ON project_learnings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete project_learnings"
  ON project_learnings
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE project_learnings IS 'Documents lessons learned during the project';
