"use client";

import { useEffect, useState, useCallback } from "react";
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

        type ProjectRow = Omit<ProjectWithTechnologies, "technologies"> & {
          image_url?: string | null;
        };
        type ProjectTechRow = {
          project_id: number;
          technologies: Technology | Technology[] | null;
        };
        const toTechnology = (value: Technology | Technology[] | null): Technology | null =>
          Array.isArray(value) ? value[0] ?? null : value;

        // Normalize image_url -> image_urls and map technologies to projects
        const projectsWithTechs: ProjectWithTechnologies[] = projectsData.map(
          (project) => {
            const raw = project as unknown as ProjectRow;
            // Support both old image_url (string) and new image_urls (string[])
            let image_urls: string[];
            if (Array.isArray(raw.image_urls)) {
              image_urls = raw.image_urls;
            } else if (typeof raw.image_url === "string" && raw.image_url) {
              image_urls = raw.image_url.startsWith("[")
                ? JSON.parse(raw.image_url)
                : [raw.image_url];
            } else {
              image_urls = [];
            }
            return {
              id: raw.id,
              title: raw.title,
              slug: raw.slug,
              description: raw.description,
              demo_url: raw.demo_url,
              github_url: raw.github_url,
              created_at: raw.created_at,
              updated_at: raw.updated_at,
              image_urls,
              technologies:
                (projectTechs as unknown as ProjectTechRow[] | null)
                  ?.filter((pt) => pt.project_id === project.id)
                  .map((pt) => toTechnology(pt.technologies))
                  .filter((tech): tech is Technology => tech !== null) || [],
            };
          }
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

// ==================== Project Child Entity Hooks ====================
// Import types used by child entity hooks
import type {
  ProjectProblem,
  ProjectSolution,
  ProjectDesign,
  ProjectFeature,
  ProjectTesting,
  ProjectResult,
  ProjectLearning,
  ProjectWithDetails,
  ReorderItem,
} from "@/types/portfolio";

import {
  getProjectProblems,
  createProjectProblem,
  updateProjectProblem,
  deleteProjectProblem,
  reorderProjectProblems,
  getProjectSolutions,
  createProjectSolution,
  updateProjectSolution,
  deleteProjectSolution,
  reorderProjectSolutions,
  getProjectDesigns,
  createProjectDesign,
  updateProjectDesign,
  deleteProjectDesign,
  reorderProjectDesigns,
  getProjectFeatures,
  createProjectFeature,
  updateProjectFeature,
  deleteProjectFeature,
  reorderProjectFeatures,
  getProjectTestings,
  createProjectTesting,
  updateProjectTesting,
  deleteProjectTesting,
  reorderProjectTestings,
  getProjectResults,
  createProjectResult,
  updateProjectResult,
  deleteProjectResult,
  reorderProjectResults,
  getProjectLearnings,
  createProjectLearning,
  updateProjectLearning,
  deleteProjectLearning,
  reorderProjectLearnings,
  getProjectWithDetails,
  getProjectBySlug,
} from "@/lib/actions/portfolio";

type ApiResult<T> = { data: T | null; error: string | null };

type MutationOptions<T> = {
  onSuccess?: (data: T | null) => void;
  onError?: (error: string) => void;
};

// ─── Generic mutation hook factory ────────────────────────────────

function useMutation<TArgs extends unknown[], TReturn>(
  actionFn: (...args: TArgs) => Promise<{ data: TReturn | null; error: string | null }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (...args: [...TArgs, MutationOptions<TReturn>?]): Promise<ApiResult<TReturn>> => {
    const maybeOptions = args[args.length - 1];
    const options =
      typeof maybeOptions === "object" &&
      maybeOptions !== null &&
      ("onSuccess" in maybeOptions || "onError" in maybeOptions)
        ? (args.pop() as MutationOptions<TReturn>)
        : undefined;

    setLoading(true);
    setError(null);
    try {
      const result = await actionFn(...(args as unknown as TArgs));
      if (result.error) {
        setError(result.error);
        options?.onError?.(result.error);
      } else {
        options?.onSuccess?.(result.data);
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      options?.onError?.(msg);
      return { data: null, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// ─── Read hook factory ─────────────────────────────────────────────

function useProjectChildEntities<T>(
  table: string,
  projectId: number | null,
  fetchFn: (id: number) => Promise<{ data: T[] | null; error: string | null }>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(projectId);
      if (result.error) throw new Error(result.error);
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [projectId, fetchFn]);

  useEffect(() => {
    void Promise.resolve().then(fetch);

    if (!projectId) return;

    const channel = supabaseClient
      .channel(`${table}-${projectId}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        fetch();
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [projectId, fetch, table]);

  return { data, loading, error, refetch: fetch };
}

function useProjectDetailsRealtime(projectId: number | null) {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!projectId) {
      setProject(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getProjectWithDetails(projectId);
      if (result.error) throw new Error(result.error);
      setProject(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void Promise.resolve().then(fetch);

    if (!projectId) return;

    const tables = [
      "projects",
      "project_technologies",
      "project_problems",
      "project_solutions",
      "project_designs",
      "project_features",
      "project_testings",
      "project_results",
      "project_learnings",
    ];

    const channels = tables.map((table) =>
      supabaseClient
        .channel(`${table}-details-${projectId}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, fetch)
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => {
        supabaseClient.removeChannel(channel);
      });
    };
  }, [fetch, projectId]);

  return { project, loading, error, refetch: fetch };
}

function useProjectDetailsBySlug(slug: string | null) {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!slug) {
      setProject(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getProjectBySlug(slug);
      if (result.error) throw new Error(result.error);
      if (!result.data) throw new Error("Project not found");
      
      // Fetch full details with all related data
      const detailsResult = await getProjectWithDetails(result.data.id);
      if (detailsResult.error) throw new Error(detailsResult.error);
      setProject(detailsResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void Promise.resolve().then(fetch);

    if (!slug) return;

    // Subscribe to realtime changes
    const tables = [
      "projects",
      "project_technologies",
      "project_problems",
      "project_solutions",
      "project_designs",
      "project_features",
      "project_testings",
      "project_results",
      "project_learnings",
    ];

    const channels = tables.map((table) =>
      supabaseClient
        .channel(`${table}-details-slug-${slug}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, fetch)
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => {
        supabaseClient.removeChannel(channel);
      });
    };
  }, [fetch, slug]);

  return { project, loading, error, refetch: fetch };
}

export function useProjectProblems(projectId: number | null) {
  const result = useProjectChildEntities<ProjectProblem>("project_problems", projectId, getProjectProblems);
  return { ...result, problems: result.data };
}

export function useProjectSolutions(projectId: number | null) {
  const result = useProjectChildEntities<ProjectSolution>("project_solutions", projectId, getProjectSolutions);
  return { ...result, solutions: result.data };
}

export function useProjectDesigns(projectId: number | null) {
  const result = useProjectChildEntities<ProjectDesign>("project_designs", projectId, getProjectDesigns);
  return { ...result, designs: result.data };
}

export function useProjectFeatures(projectId: number | null) {
  const result = useProjectChildEntities<ProjectFeature>("project_features", projectId, getProjectFeatures);
  return { ...result, features: result.data };
}

export function useProjectTestings(projectId: number | null) {
  const result = useProjectChildEntities<ProjectTesting>("project_testings", projectId, getProjectTestings);
  return { ...result, testings: result.data };
}

export function useProjectResults(projectId: number | null) {
  const result = useProjectChildEntities<ProjectResult>("project_results", projectId, getProjectResults);
  return { ...result, results: result.data };
}

export function useProjectLearnings(projectId: number | null) {
  const result = useProjectChildEntities<ProjectLearning>("project_learnings", projectId, getProjectLearnings);
  return { ...result, learnings: result.data };
}

export function useProjectWithDetails(projectId: number | null) {
  return useProjectDetailsRealtime(projectId);
}

export function useProjectWithDetailsBySlug(slug: string | null) {
  return useProjectDetailsBySlug(slug);
}

export function useCreateProjectProblem() {
  return useMutation<Parameters<typeof createProjectProblem>, ProjectProblem>(createProjectProblem);
}

export function useUpdateProjectProblem() {
  return useMutation<Parameters<typeof updateProjectProblem>, ProjectProblem>(updateProjectProblem);
}

export function useDeleteProjectProblem() {
  return useMutation<Parameters<typeof deleteProjectProblem>, null>(deleteProjectProblem);
}

export function useCreateProjectSolution() {
  return useMutation<Parameters<typeof createProjectSolution>, ProjectSolution>(createProjectSolution);
}

export function useUpdateProjectSolution() {
  return useMutation<Parameters<typeof updateProjectSolution>, ProjectSolution>(updateProjectSolution);
}

export function useDeleteProjectSolution() {
  return useMutation<Parameters<typeof deleteProjectSolution>, null>(deleteProjectSolution);
}

export function useCreateProjectDesign() {
  return useMutation<Parameters<typeof createProjectDesign>, ProjectDesign>(createProjectDesign);
}

export function useUpdateProjectDesign() {
  return useMutation<Parameters<typeof updateProjectDesign>, ProjectDesign>(updateProjectDesign);
}

export function useDeleteProjectDesign() {
  return useMutation<Parameters<typeof deleteProjectDesign>, null>(deleteProjectDesign);
}

export function useCreateProjectFeature() {
  return useMutation<Parameters<typeof createProjectFeature>, ProjectFeature>(createProjectFeature);
}

export function useUpdateProjectFeature() {
  return useMutation<Parameters<typeof updateProjectFeature>, ProjectFeature>(updateProjectFeature);
}

export function useDeleteProjectFeature() {
  return useMutation<Parameters<typeof deleteProjectFeature>, null>(deleteProjectFeature);
}

export function useCreateProjectTesting() {
  return useMutation<Parameters<typeof createProjectTesting>, ProjectTesting>(createProjectTesting);
}

export function useUpdateProjectTesting() {
  return useMutation<Parameters<typeof updateProjectTesting>, ProjectTesting>(updateProjectTesting);
}

export function useDeleteProjectTesting() {
  return useMutation<Parameters<typeof deleteProjectTesting>, null>(deleteProjectTesting);
}

export function useCreateProjectResult() {
  return useMutation<Parameters<typeof createProjectResult>, ProjectResult>(createProjectResult);
}

export function useUpdateProjectResult() {
  return useMutation<Parameters<typeof updateProjectResult>, ProjectResult>(updateProjectResult);
}

export function useDeleteProjectResult() {
  return useMutation<Parameters<typeof deleteProjectResult>, null>(deleteProjectResult);
}

export function useCreateProjectLearning() {
  return useMutation<Parameters<typeof createProjectLearning>, ProjectLearning>(createProjectLearning);
}

export function useUpdateProjectLearning() {
  return useMutation<Parameters<typeof updateProjectLearning>, ProjectLearning>(updateProjectLearning);
}

export function useDeleteProjectLearning() {
  return useMutation<Parameters<typeof deleteProjectLearning>, null>(deleteProjectLearning);
}

export function useReorderProjectProblems() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectProblems);
}

export function useReorderProjectSolutions() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectSolutions);
}

export function useReorderProjectDesigns() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectDesigns);
}

export function useReorderProjectFeatures() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectFeatures);
}

export function useReorderProjectTestings() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectTestings);
}

export function useReorderProjectResults() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectResults);
}

export function useReorderProjectLearnings() {
  return useMutation<[number, ReorderItem[]], null>(reorderProjectLearnings);
}
