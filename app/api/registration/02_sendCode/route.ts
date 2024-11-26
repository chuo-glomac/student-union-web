import crypto from "crypto";
import { getUrl } from "@/utils/getUrl";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/sendEmail";
const prisma = new PrismaClient();

export async function GET() {
  return Response.json({ ok: false });
}

export async function POST(req: Request) {
  try {
    const {
      email,
      temporaryId,
      universityId,
      departmentId,
      studentNo,
      studentEmail,
    } = await req.json();
    console.log(email, temporaryId, studentNo, studentEmail);

    const userAccess = await prisma.userAccess.findUnique({
      where: {
        email,
        temporary_id: temporaryId,
      },
    });
    if (!userAccess)
      return Response.json({ ok: false, message: "No match user." });

    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    const matchingStudents = await prisma.students.findMany({
      where: {
        OR: [{ student_no: studentNo }, { student_email: studentEmail }],
      },
      include: {
        member: true, // Include the related member data
      },
    });

    let retry = 0;
    if (matchingStudents.length > 0) {
      // console.log('Matching validation records:', matchingValidations);
      const recordsForced = matchingStudents.filter(
        (student) => student.force == true
      );
      const recordsWithoutMember = matchingStudents.filter(
        (student) => student.force == false
      );

      if (recordsForced.length > 0) {
        if (recordsForced[0].validated === true) {
          return Response.json({ ok: false, message: "Entry already exsits." });
        }

        const forceStudentData = await prisma.students.findUnique({
          where: {
            student_no: studentNo,
            student_email: studentEmail,
          },
        });
        if (!forceStudentData) {
          return Response.json({
            ok: false,
            message: "Unknown error: Force student data.",
          });
        }

        return Response.json({ ok: true, message: "Force entry is created." });
      }

      if (recordsWithoutMember.length > 0) {
        if (recordsWithoutMember[0].validated === true) {
          return Response.json({ ok: false, message: "Entry already exsits." });
        }

        console.log("Override validation:", recordsWithoutMember);

        const noneForceStudentData = await prisma.students.update({
          where: {
            student_no: studentNo,
            student_email: studentEmail,
          },
          data: {
            date_of_entry: new Date(),
            trial_send: { increment: 1 },
            code,
          },
        });
        if (!noneForceStudentData) {
          return Response.json({
            ok: false,
            message: "Unknown error: Non-force student data.",
          });
        }
      }
    } else {
      await prisma.students.create({
        data: {
          university: {
            connect: { university_id: universityId },
          },
          department: {
            connect: { department_id: departmentId },
          },
          student_no: studentNo,
          student_email: studentEmail,
          code,
          member: {
            connect: { member_id: userAccess.member_id },
          },
          discordCode: "",
        },
      });
    }

    let subject = "[Student Union] 大学メールアドレスの認証";
    let message = `
Student Union にご登録ありがとうございます。
手続きを進めるためには、以下の認証コードをご入力ください。

認証コード：${code}
以上のコードは３０分間のみ有効になります。

※This is a send-only address, you cannot reply.
※If this was not for you please contact us.
※宛先が異なるなど、ご不明な点はヘルプデスクまでご連絡ください。

━━━━━━━━━━━━━━━━
Send by Student Union
[Help Desk]
${getUrl()}/support

このメールの再配信および掲載記事の無断転載は禁止
Copyright(C) All rights reserved.
      `;
    await sendEmail("Student Union", [studentEmail], subject, message);

    return Response.json({ ok: true, message: "Email send to university email." });
  } catch (err) {
    console.log(typeof err);
    return Response.json({ ok: false, message: `Unknown error: ${err}` });
  }
}