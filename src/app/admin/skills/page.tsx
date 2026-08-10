import { getSkills } from "@/lib/actions/portfolio";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { SkillsClient } from "./SkillsClient";

export default async function SkillsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: skills, error } = await getSkills();

  return (
    <SkillsClient
      initialSkills={skills || []}
      userEmail={user.email || ""}
      error={error}
    />
  );
}
