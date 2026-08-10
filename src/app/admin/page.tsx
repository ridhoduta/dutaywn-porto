import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import {
  getSkills,
  getProjects,
  getCertifications,
  getEducations,
} from "@/lib/actions/portfolio";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }

  // Fetch stats for dashboard
  const [skillsResult, projectsResult, certificationsResult, educationResult] =
    await Promise.all([
      getSkills(),
      getProjects(),
      getCertifications(),
      getEducations(),
    ]);

  const stats = {
    skills: skillsResult.data?.length || 0,
    projects: projectsResult.data?.length || 0,
    certifications: certificationsResult.data?.length || 0,
    education: educationResult.data?.length || 0,
  };

  return <AdminDashboardClient userEmail={user.email || ""} stats={stats} />;
}
