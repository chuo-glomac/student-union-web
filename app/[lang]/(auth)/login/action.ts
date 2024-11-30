"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const confirmUser = async (currentLang: string = 'en-US', redirectTo: string) => {
  console.log('Confirm User.')
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log(error);
    // redirect("/login");
    return;
  }

  redirect(redirectTo);
};
