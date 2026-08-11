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
