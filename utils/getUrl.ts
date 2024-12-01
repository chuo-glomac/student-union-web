"use client";
// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUrl = () => {
  // let url = process.env.LOCAL_URL ?? 'http://glomac-student-union.vercel.app/'

  // url = url.startsWith('http') ? url : `https://${url}`
  // url = url.endsWith('/') ? url : `${url}/`

  let url = "https://web.student-union.pro";

  return url;
};

// export const getUserPath = async () => {
//   const supabase = await createClient();
//   const { data, error } = await supabase.auth.getUser();

//   if (error || !data?.user) {
//     return { ok: false, message: "No user detected.", url: '' };
//   }

//   const userAccess = await prisma.userAccess.findUnique({
//     where: {
//       user_id: data.user.id,
//     },
//   });
//   const student = await prisma.students.findUnique({
//     where: {
//       member_id: userAccess?.member_id,
//     },
//   });
//   const universityId = student?.university_id;

//   return { ok: true, url: `/${universityId}` };
// };
