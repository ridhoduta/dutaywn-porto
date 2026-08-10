"use server";

import { signOut } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

/**
 * Server action to handle admin logout
 */
export async function handleLogout() {
  await signOut();
  redirect("/admin/login");
}
