// Core type definitions for portfolio system

export type Profile = {
  id: number;
  name: string;
  title: string;
  description: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  display_order: number;
  created_at: string;
};

export type Technology = {
  id: number;
  name: string;
  icon: string | null;
  created_at: string;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  role?: string | null;
  duration?: string | null;
  platform?: string | null;
  team?: string | null;
  image_urls: string[];
  demo_url: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectTechnology = {
  id: number;
  project_id: number;
  technology_id: number;
};

export type ProjectWithTechnologies = Project & {
  technologies: Technology[];
};

export type Certification = {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  description: string | null;
  created_at: string;
};

export type Education = {
  id: number;
  institution: string;
  degree: string;
  field: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  display_order: number;
  created_at: string;
};

export type PortfolioData = {
  profile: Profile | null;
  skills: Skill[];
  projects: ProjectWithTechnologies[];
  certifications: Certification[];
  educations: Education[];
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// ==================== Project Child Entities ====================

export type ProjectProblem = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectSolution = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectDesignType =
  | "wireframe"
  | "mockup"
  | "prototype"
  | "uml"
  | "flowchart"
  | string;

export type ProjectDesign = {
  id: number;
  project_id: number;
  type: ProjectDesignType;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectFeature = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectTestingStatus = "passed" | "failed" | "pending" | "skipped";

export type ProjectTesting = {
  id: number;
  project_id: number;
  test_case: string;
  expected_result: string;
  actual_result: string;
  status: ProjectTestingStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectResult = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectLearning = {
  id: number;
  project_id: number;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Reorder payload — used by batch reorder actions and hooks */
export type ReorderItem = {
  id: number;
  sort_order: number;
};

/** Fully enriched project with all child entities */
export type ProjectWithDetails = ProjectWithTechnologies & {
  problems: ProjectProblem[];
  solutions: ProjectSolution[];
  designs: ProjectDesign[];
  features: ProjectFeature[];
  testings: ProjectTesting[];
  results: ProjectResult[];
  learnings: ProjectLearning[];
};
