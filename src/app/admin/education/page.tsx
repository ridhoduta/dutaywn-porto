import { getEducations } from "@/lib/actions/portfolio";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { EducationClient } from "./EducationClient";

export default async function EducationPage() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: education, error } = await getEducations();

  return (
    <EducationClient
      initialEducation={education || []}
      userEmail={user.email || ""}
      error={error}
    />
  );
}
