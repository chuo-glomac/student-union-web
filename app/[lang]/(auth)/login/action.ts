"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const confirmUser = async (currentLang: string = 'en-US') => {
  console.log('Confirm User.')
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log(error);
    redirect("/login");
    // return;
  }

  const userAccess = await prisma.userAccess.findUnique({
    where: {
      user_id: data.user.id,
    }
  })
  const student = await prisma.students.findUnique({
    where: {
      member_id: userAccess?.member_id
    }
  })
  const universityId = student?.university_id

  redirect(`/${currentLang}/${universityId}/home`);
};
