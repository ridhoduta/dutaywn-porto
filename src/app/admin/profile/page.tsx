import { getProfile } from "@/lib/actions/portfolio";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await getProfile();

  return (
    <ProfileClient
      initialProfile={profile}
      userEmail={user.email || ""}
      error={error}
    />
  );
}
