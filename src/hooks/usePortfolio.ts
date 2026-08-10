"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import type {
  Profile,
  Skill,
  ProjectWithTechnologies,
  Certification,
  Education,
  Technology,
} from "@/types/portfolio";

// ==================== Profile Hook ====================

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}

// ==================== Skills Hook ====================

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("skills")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setSkills(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();

    // Subscribe to real-time changes
    const channel = supabaseClient
      .channel("skills-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        () => {
          fetchSkills();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return { skills, loading, error, refetch: () => setLoading(true) };
}

// ==================== Technologies Hook ====================

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("technologies")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setTechnologies(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();

    // Subscribe to real-time changes
    const channel = supabaseClient
      .channel("technologies-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "technologies" },
        () => {
          fetchTechnologies();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return { technologies, loading, error, refetch: () => setLoading(true) };
}

// ==================== Projects Hook ====================

export function useProjects() {
  const [projects, setProjects] = useState<ProjectWithTechnologies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get projects
        const { data: projectsData, error: projectsError } =
          await supabaseClient
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (projectsError) throw projectsError;

        if (!projectsData || projectsData.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        // Get project technologies
        const { data: projectTechs, error: techsError } = await supabaseClient
          .from("project_technologies")
          .select(
            `
            project_id,
            technologies (
              id,
              name,
              icon,
              created_at
            )
          `
          )
          .in(
            "project_id",
            projectsData.map((p) => p.id)
          );

        if (techsError) throw techsError;

        // Map technologies to projects
        const projectsWithTechs: ProjectWithTechnologies[] = projectsData.map(
          (project) => ({
            ...project,
            technologies:
              projectTechs
                ?.filter((pt: any) => pt.project_id === project.id)
                .map((pt: any) => pt.technologies)
                .filter(Boolean) || [],
          })
        );

        setProjects(projectsWithTechs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to real-time changes
    const projectsChannel = supabaseClient
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    const techsChannel = supabaseClient
      .channel("project-technologies-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_technologies" },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(projectsChannel);
      supabaseClient.removeChannel(techsChannel);
    };
  }, []);

  return { projects, loading, error, refetch: () => setLoading(true) };
}

// ==================== Certifications Hook ====================

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("certifications")
          .select("*")
          .order("issue_date", { ascending: false });

        if (error) throw error;
        setCertifications(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();

    // Subscribe to real-time changes
    const channel = supabaseClient
      .channel("certifications-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "certifications" },
        () => {
          fetchCertifications();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return {
    certifications,
    loading,
    error,
    refetch: () => setLoading(true),
  };
}

// ==================== Education Hook ====================

export function useEducations() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("educations")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setEducations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();

    // Subscribe to real-time changes
    const channel = supabaseClient
      .channel("educations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "educations" },
        () => {
          fetchEducations();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return { educations, loading, error, refetch: () => setLoading(true) };
}
