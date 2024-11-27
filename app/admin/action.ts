"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const confirmUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
    // return;
  }

  const email = data.user.email;
  const userAccess = await prisma.userAccess.findUnique({
    where: { email },
  });

  if (!userAccess) {
    redirect("/login");
    // return;
  }

  const { role } = userAccess;

  if (role !== "MODERATOR" && role !== "ADMIN") {
    redirect("/home");
    // return { ok: false, message: "Role not authorized." };
  }

  return { ok: true, member_id: userAccess.member_id, role };
};
