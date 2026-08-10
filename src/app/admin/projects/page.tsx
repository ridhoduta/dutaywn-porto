import { getProjects, getTechnologies } from "@/lib/actions/portfolio";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [projectsResult, technologiesResult] = await Promise.all([
    getProjects(),
    getTechnologies(),
  ]);

  return (
    <ProjectsClient
      initialProjects={projectsResult.data || []}
      technologies={technologiesResult.data || []}
      userEmail={user.email || ""}
      error={projectsResult.error || technologiesResult.error}
    />
  );
}
