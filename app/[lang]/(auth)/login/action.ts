"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const confirmUser = async (
  currentLang: string = "en-US",
  redirectTo: string = "/home"
) => {
  console.log("Confirm User.");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log(error);
    // redirect("/login");
    return;
  }

  console.log(redirectTo)
  revalidatePath("/", "layout");
  redirect(redirectTo);
};

export const login = async (formData: FormData, redirectTo: string) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(decodeURIComponent(redirectTo));
};
