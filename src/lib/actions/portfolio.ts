"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  Skill,
  Project,
  ProjectWithTechnologies,
  Certification,
  Education,
  Technology,
  ApiResponse,
  PortfolioData,
} from "@/types/portfolio";

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
  id: number,
  profile: Partial<Profile>
): Promise<ApiResponse<Profile>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
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
  skill: Omit<Skill, "id" | "created_at">
): Promise<ApiResponse<Skill>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .insert(skill)
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
          projectTechs
            ?.filter((pt: any) => pt.project_id === project.id)
            .map((pt: any) => pt.technologies)
            .filter(Boolean) || [],
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
        projectTechs?.map((pt: any) => pt.technologies).filter(Boolean) || [],
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

    // Create project
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Add technologies
    if (technologyIds.length > 0) {
      const projectTechs = technologyIds.map((techId) => ({
        project_id: data.id,
        technology_id: techId,
      }));

      const { error: techError } = await supabase
        .from("project_technologies")
        .insert(projectTechs);

      if (techError) {
        // Rollback: delete the project
        await supabase.from("projects").delete().eq("id", data.id);
        return { data: null, error: techError.message };
      }
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateProject(
  id: number,
  project: Partial<Project>,
  technologyIds?: number[]
): Promise<ApiResponse<Project>> {
  try {
    const supabase = await createClient();

    // Update project
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Update technologies if provided
    if (technologyIds !== undefined) {
      // Delete existing technologies
      await supabase.from("project_technologies").delete().eq("project_id", id);

      // Add new technologies
      if (technologyIds.length > 0) {
        const projectTechs = technologyIds.map((techId) => ({
          project_id: id,
          technology_id: techId,
        }));

        const { error: techError } = await supabase
          .from("project_technologies")
          .insert(projectTechs);

        if (techError) {
          return { data: null, error: techError.message };
        }
      }
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteProject(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createClient();

    // Delete project technologies first (foreign key constraint)
    await supabase.from("project_technologies").delete().eq("project_id", id);

    // Delete project
    const { error } = await supabase.from("projects").delete().eq("id", id);

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

// ==================== Certifications ====================

export async function getCertifications(): Promise<
  ApiResponse<Certification[]>
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("issue_date", { ascending: false });

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
  education: Omit<Education, "id" | "created_at">
): Promise<ApiResponse<Education>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("educations")
      .insert(education)
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

    // Check for any errors
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
