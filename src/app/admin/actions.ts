"use server";

import { signIn } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";

export type LoginFormState = {
  success?: boolean;
  error?: string;
};

/**
 * Server action to handle admin login
 * Validates credentials and redirects on success
 */
export async function handleLogin(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation
  if (!email || !password) {
    return {
      success: false,
      error: "Email dan password harus diisi",
    };
  }

  if (!email.includes("@")) {
    return {
      success: false,
      error: "Format email tidak valid",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: "Password minimal 6 karakter",
    };
  }

  // Attempt login
  const result = await signIn(email, password);

  if (!result.success) {
    return {
      success: false,
      error: result.error || "Login gagal. Periksa email dan password Anda.",
    };
  }

  // Redirect to dashboard on success
  redirect("/admin");
}
