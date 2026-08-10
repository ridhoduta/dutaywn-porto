import { getCertifications } from "@/lib/actions/portfolio";
import { getUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { CertificationsClient } from "./CertificationsClient";

export default async function CertificationsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { data: certifications, error } = await getCertifications();

  return (
    <CertificationsClient
      initialCertifications={certifications || []}
      userEmail={user.email || ""}
      error={error}
    />
  );
}
