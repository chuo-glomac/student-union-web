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
    return;
  }

  console.log(redirectTo);
  console.log(decodeURIComponent(redirectTo));

  revalidatePath(`/`, "layout");
  redirect(decodeURIComponent(redirectTo));
};

export const login = async (
  formData: FormData,
  redirectTo: string = "/home"
) => {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  if (userData?.user) {
    revalidatePath("/", "layout");
    redirect(decodeURIComponent(redirectTo));
  }

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // console.log(decodeURIComponent(redirectTo));
  revalidatePath("/", "layout");
  redirect(decodeURIComponent(redirectTo));
};
