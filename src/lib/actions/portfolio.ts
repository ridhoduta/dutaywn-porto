"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  Skill,
  Project,
  ProjectWithTechnologies,
  ProjectWithDetails,
  ProjectProblem,
  ProjectSolution,
  ProjectDesign,
  ProjectFeature,
  ProjectTesting,
  ProjectResult,
  ProjectLearning,
  ReorderItem,
  Certification,
  Education,
  Technology,
  ApiResponse,
  PortfolioData,
} from "@/types/portfolio";

function isBlank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length === 0;
}

function missingFields(fields: Array<[string, unknown]>) {
  return fields.filter(([, value]) => value === undefined || value === null || isBlank(value));
}

function requiredError(name: string, fields: Array<[string, unknown]>) {
  const missing = missingFields(fields).map(([key]) => key);
  return missing.length > 0 ? `${name}: missing required field(s): ${missing.join(", ")}` : null;
}

// ==================== Profile ====================

export async function getProfile(): Promise<ApiResponse<Profile>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateProfile(
  profile: Partial<Profile>
): Promise<ApiResponse<Profile>>;
export async function updateProfile(
  id: number,
  profile: Partial<Profile>
): Promise<ApiResponse<Profile>>;
export async function updateProfile(
  idOrProfile: number | Partial<Profile>,
  maybeProfile?: Partial<Profile>
): Promise<ApiResponse<Profile>> {
  try {
    const supabase = await createClient();
    let id: number | undefined;
    let profileData: Partial<Profile>;

    if (typeof idOrProfile === "number") {
      id = idOrProfile;
      profileData = maybeProfile || {};
    } else {
      profileData = idOrProfile;
    }

    if (id) {
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } else {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .maybeSingle();

      if (existing?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", existing.id)
          .select()
          .single();

        if (error) {
          return { data: null, error: error.message };
        }

        return { data, error: null };
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .insert(profileData)
          .select()
          .single();

        if (error) {
          return { data: null, error: error.message };
        }

        return { data, error: null };
      }
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== Skills ====================

export async function getSkills(): Promise<ApiResponse<Skill[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createSkill(
  skill: Omit<Skill, "id" | "created_at" | "display_order"> & {
    display_order?: number;
  }
): Promise<ApiResponse<Skill>> {
  try {
    const supabase = await createClient();
    const skillData = {
      display_order: 0,
      ...skill,
    };
    const { data, error } = await supabase
      .from("skills")
      .insert(skillData)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateSkill(
  id: number,
  skill: Partial<Skill>
): Promise<ApiResponse<Skill>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .update(skill)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteSkill(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== Technologies ====================

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createTechnology(
  technology: Omit<Technology, "id" | "created_at">
): Promise<ApiResponse<Technology>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("technologies")
      .insert(technology)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== Projects ====================

type ProjectTechnologyRow = {
  project_id?: number;
  technologies: Technology | Technology[] | null;
};

type ProjectWithTechnologyRows = Project & {
  project_technologies?: ProjectTechnologyRow[];
};

/** Normalize a raw DB project row → typed Project */
function normalizeProject(row: Project): Project {
  return {
    ...row,
    image_urls: row.image_urls || [],
  };
}

function isTechnology(value: Technology | null): value is Technology {
  return value !== null;
}

function toTechnology(value: Technology | Technology[] | null): Technology | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export async function getProjects(): Promise<
  ApiResponse<ProjectWithTechnologies[]>
> {
  try {
    const supabase = await createClient();

    // Get projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (projectsError) {
      return { data: null, error: projectsError.message };
    }

    if (!projects || projects.length === 0) {
      return { data: [], error: null };
    }

    // Get project technologies with technology details
    const { data: projectTechs, error: techsError } = await supabase
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
        projects.map((p) => p.id)
      );

    if (techsError) {
      return { data: null, error: techsError.message };
    }

    // Map technologies to projects
    const projectsWithTechs: ProjectWithTechnologies[] = projects.map(
      (project) => ({
        ...project,
        technologies:
          (projectTechs as unknown as ProjectTechnologyRow[] | null)
            ?.filter((pt) => pt.project_id === project.id)
            .map((pt) => toTechnology(pt.technologies))
            .filter(isTechnology) || [],
      })
    );

    return { data: projectsWithTechs, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<ApiResponse<ProjectWithTechnologies>> {
  try {
    const supabase = await createClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (projectError) {
      return { data: null, error: projectError.message };
    }

    // Get technologies for this project
    const { data: projectTechs, error: techsError } = await supabase
      .from("project_technologies")
      .select(
        `
        technologies (
          id,
          name,
          icon,
          created_at
        )
      `
      )
      .eq("project_id", project.id);

    if (techsError) {
      return { data: null, error: techsError.message };
    }

    const projectWithTechs: ProjectWithTechnologies = {
      ...project,
      technologies:
        (projectTechs as unknown as ProjectTechnologyRow[] | null)
          ?.map((pt) => toTechnology(pt.technologies))
          .filter(isTechnology) || [],
    };

    return { data: projectWithTechs, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
  technologyIds: number[]
): Promise<ApiResponse<Project>> {
  try {
    const supabase = await createClient();
    const projectPayload = { ...project };
    delete (projectPayload as Record<string, unknown>).image_url;
    if (!projectPayload.image_urls) {
      projectPayload.image_urls = [];
    }

    const { data, error } = await supabase
      .from("projects")
      .insert(projectPayload)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (technologyIds.length > 0) {
      const { error: techError } = await supabase
        .from("project_technologies")
        .insert(technologyIds.map((techId) => ({ project_id: data.id, technology_id: techId })));

      if (techError) {
        await supabase.from("projects").delete().eq("id", data.id);
        return { data: null, error: techError.message };
      }
    }

    return { data: normalizeProject(data), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProject(
  id: number,
  project: Partial<Project>,
  technologyIds?: number[]
): Promise<ApiResponse<Project>> {
  try {
    const supabase = await createClient();
    const projectPayload = { ...project };
    delete (projectPayload as Record<string, unknown>).image_url;

    const { data, error } = await supabase
      .from("projects")
      .update(projectPayload)
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (technologyIds !== undefined) {
      await supabase.from("project_technologies").delete().eq("project_id", id);
      if (technologyIds.length > 0) {
        const { error: techError } = await supabase
          .from("project_technologies")
          .insert(technologyIds.map((techId) => ({ project_id: id, technology_id: techId })));
        if (techError) return { data: null, error: techError.message };
      }
    }

    return { data: normalizeProject(data), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProject(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    await supabase.from("project_technologies").delete().eq("project_id", id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ==================== Certifications ====================

export async function getCertifications(): Promise<ApiResponse<Certification[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("issue_date", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createCertification(
  certification: Omit<Certification, "id" | "created_at">
): Promise<ApiResponse<Certification>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .insert(certification)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateCertification(
  id: number,
  certification: Partial<Certification>
): Promise<ApiResponse<Certification>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .update(certification)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCertification(
  id: number
): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("id", id);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== Education ====================

export async function getEducations(): Promise<ApiResponse<Education[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("educations")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createEducation(
  education: Omit<Education, "id" | "created_at" | "display_order"> & {
    display_order?: number;
  }
): Promise<ApiResponse<Education>> {
  try {
    const supabase = await createClient();
    const educationData = {
      display_order: 0,
      ...education,
    };
    const { data, error } = await supabase
      .from("educations")
      .insert(educationData)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateEducation(
  id: number,
  education: Partial<Education>
): Promise<ApiResponse<Education>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("educations")
      .update(education)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteEducation(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("educations").delete().eq("id", id);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== Complete Portfolio Data ====================

export async function getPortfolioData(): Promise<ApiResponse<PortfolioData>> {
  try {
    const [profile, skills, projects, certifications, educations] =
      await Promise.all([
        getProfile(),
        getSkills(),
        getProjects(),
        getCertifications(),
        getEducations(),
      ]);

    const errors = [
      profile.error,
      skills.error,
      projects.error,
      certifications.error,
      educations.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return { data: null, error: errors.join(", ") };
    }

    return {
      data: {
        profile: profile.data,
        skills: skills.data || [],
        projects: projects.data || [],
        certifications: certifications.data || [],
        educations: educations.data || [],
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== Project Child Entities — Shared Helper ====================

/**
 * Generic batch reorder: update sort_order for multiple records in one table.
 * Runs individual updates (Supabase JS client does not support bulk UPDATE natively).
 */
async function batchReorder(
  table: string,
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return { data: null, error: "items must be a non-empty array" };
    }

    const ids = new Set<number>();
    for (const item of items) {
      if (!item || typeof item.id !== "number" || typeof item.sort_order !== "number") {
        return { data: null, error: "items must contain id and sort_order numbers" };
      }
      if (ids.has(item.id)) {
        return { data: null, error: "items contains duplicate id" };
      }
      ids.add(item.id);
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc("reorder_project_child_entities", {
      table_name: table,
      project_id_value: projectId,
      reorder_items: items,
    });

    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// ==================== PROJECT_PROBLEMS ====================

export async function getProjectProblems(
  projectId: number
): Promise<ApiResponse<ProjectProblem[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_problems")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectProblem(
  projectId: number,
  data: Omit<ProjectProblem, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectProblem>> {
  try {
    const validationError = requiredError("ProjectProblem", [["title", data.title], ["description", data.description]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_problems")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectProblem(
  id: number,
  data: Partial<Omit<ProjectProblem, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectProblem>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_problems")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectProblem(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_problems").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectProblems(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_problems", projectId, items);
}

// ==================== PROJECT_SOLUTIONS ====================

export async function getProjectSolutions(
  projectId: number
): Promise<ApiResponse<ProjectSolution[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_solutions")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectSolution(
  projectId: number,
  data: Omit<ProjectSolution, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectSolution>> {
  try {
    const validationError = requiredError("ProjectSolution", [["title", data.title], ["description", data.description]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_solutions")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectSolution(
  id: number,
  data: Partial<Omit<ProjectSolution, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectSolution>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_solutions")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectSolution(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_solutions").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectSolutions(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_solutions", projectId, items);
}

// ==================== PROJECT_DESIGNS ====================

export async function getProjectDesigns(
  projectId: number
): Promise<ApiResponse<ProjectDesign[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_designs")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectDesign(
  projectId: number,
  data: Omit<ProjectDesign, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectDesign>> {
  try {
    const validationError = requiredError("ProjectDesign", [["type", data.type], ["title", data.title], ["description", data.description], ["image_url", data.image_url]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_designs")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectDesign(
  id: number,
  data: Partial<Omit<ProjectDesign, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectDesign>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_designs")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectDesign(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_designs").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectDesigns(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_designs", projectId, items);
}

// ==================== PROJECT_FEATURES ====================

export async function getProjectFeatures(
  projectId: number
): Promise<ApiResponse<ProjectFeature[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_features")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectFeature(
  projectId: number,
  data: Omit<ProjectFeature, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectFeature>> {
  try {
    const validationError = requiredError("ProjectFeature", [["title", data.title], ["description", data.description]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_features")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectFeature(
  id: number,
  data: Partial<Omit<ProjectFeature, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectFeature>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_features")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectFeature(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_features").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectFeatures(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_features", projectId, items);
}

// ==================== PROJECT_TESTINGS ====================

export async function getProjectTestings(
  projectId: number
): Promise<ApiResponse<ProjectTesting[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_testings")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectTesting(
  projectId: number,
  data: Omit<ProjectTesting, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectTesting>> {
  try {
    const validationError = requiredError("ProjectTesting", [["test_case", data.test_case], ["expected_result", data.expected_result], ["actual_result", data.actual_result], ["status", data.status]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_testings")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectTesting(
  id: number,
  data: Partial<Omit<ProjectTesting, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectTesting>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_testings")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectTesting(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_testings").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectTestings(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_testings", projectId, items);
}

// ==================== PROJECT_RESULTS ====================

export async function getProjectResults(
  projectId: number
): Promise<ApiResponse<ProjectResult[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_results")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectResult(
  projectId: number,
  data: Omit<ProjectResult, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectResult>> {
  try {
    const validationError = requiredError("ProjectResult", [["title", data.title], ["description", data.description]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_results")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectResult(
  id: number,
  data: Partial<Omit<ProjectResult, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectResult>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_results")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectResult(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_results").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectResults(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_results", projectId, items);
}

// ==================== PROJECT_LEARNINGS ====================

export async function getProjectLearnings(
  projectId: number
): Promise<ApiResponse<ProjectLearning[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_learnings")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) return { data: null, error: error.message };
    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function createProjectLearning(
  projectId: number,
  data: Omit<ProjectLearning, "id" | "project_id" | "created_at" | "updated_at">
): Promise<ApiResponse<ProjectLearning>> {
  try {
    const validationError = requiredError("ProjectLearning", [["content", data.content]]);
    if (validationError) return { data: null, error: validationError };
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_learnings")
      .insert({ ...data, project_id: projectId, sort_order: data.sort_order ?? 0 })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateProjectLearning(
  id: number,
  data: Partial<Omit<ProjectLearning, "id" | "project_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<ProjectLearning>> {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("project_learnings")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: row, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteProjectLearning(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("project_learnings").delete().eq("id", id);
    if (error) return { data: null, error: error.message };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function reorderProjectLearnings(
  projectId: number,
  items: ReorderItem[]
): Promise<ApiResponse<null>> {
  return batchReorder("project_learnings", projectId, items);
}

// ==================== PROJECT WITH DETAILS (Combined Fetch) ====================

export async function getProjectWithDetails(
  projectId: number
): Promise<ApiResponse<ProjectWithDetails>> {
  try {
    const [
      problemsRes,
      solutionsRes,
      designsRes,
      featuresRes,
      testingsRes,
      resultsRes,
      learningsRes,
    ] = await Promise.all([
      getProjectProblems(projectId),
      getProjectSolutions(projectId),
      getProjectDesigns(projectId),
      getProjectFeatures(projectId),
      getProjectTestings(projectId),
      getProjectResults(projectId),
      getProjectLearnings(projectId),
    ]);

    // Fetch project by id directly
    const supabase = await createClient();
    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .select("*, project_technologies(technologies(id, name, icon, created_at))")
      .eq("id", projectId)
      .single();

    if (projectError) return { data: null, error: projectError.message };

    const projectWithRelations = projectRow as ProjectWithTechnologyRows;
    const normalized = normalizeProject(projectWithRelations);
    const technologies =
      projectWithRelations.project_technologies
        ?.map((pt) => toTechnology(pt.technologies))
        .filter(isTechnology) || [];

    const projectWithDetails: ProjectWithDetails = {
      ...normalized,
      technologies,
      problems: problemsRes.data || [],
      solutions: solutionsRes.data || [],
      designs: designsRes.data || [],
      features: featuresRes.data || [],
      testings: testingsRes.data || [],
      results: resultsRes.data || [],
      learnings: learningsRes.data || [],
    };

    return { data: projectWithDetails, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
