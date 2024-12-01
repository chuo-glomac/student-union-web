"use server";
import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkUserExist = async (email: string) => {
  const userAccess = await prisma.userAccess.findUnique({
    where: {
      email,
    },
  });
  if (!userAccess) {
    return { ok: true, message: "No user found." };
  }

  return { ok: false, message: "Confirmed user found." };
};
