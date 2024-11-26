import { createInvite } from "@/utils/discord_invite";
import { getUrl } from "@/utils/getUrl";
import { sendEmail } from "@/utils/sendEmail";
import sendToDiscord from "@/utils/sendToDiscord";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  return Response.json({ ok: false });
}

export async function POST(req: Request) {
//   try {
    const { email, temporaryId, code } = await req.json();
    console.log(email, temporaryId, code)
    // const log = await req.json();
    // console.log(log);

    const userAccess = await prisma.userAccess.findUnique({
      where: {
        email,
        temporary_id: temporaryId,
      },
    });
    if (!userAccess) {
      return Response.json({ ok: false, message: "No match user." });
    }

    const member = await prisma.members.findUnique({
      where: {
        member_id: userAccess.member_id,
      },
    });
    if (!member) {
      return Response.json({ ok: false, message: "No match member." });
    }

    const student = await prisma.students.findUnique({
      where: {
        member_id: userAccess.member_id,
      },
    });
    if (!student) {
      return Response.json({ ok: false, message: "Cannot find validation." });
      // return false;
    }

    const now = new Date().toISOString();
    const dateOfEntry = new Date(student.date_of_entry).toISOString();
    const diffInMinutes =
      (new Date(now).getTime() - new Date(dateOfEntry).getTime()) / (1000 * 60);
    if (diffInMinutes > 45 && student.force === false) {
      console.log("Code has expired:", diffInMinutes);
      return Response.json({ ok: false, message: "Code has expired." });
    }

    if (student.trial_count > 3) {
      return Response.json({ ok: false, message: "Too match trial." });
    }
    if (student.code !== code) {
      return Response.json({ ok: false, message: "Code doesn't match." });
    }

    const { inviteLink, code: inviteCode } = await createInvite();

    await prisma.students.update({
        where: {
            student_id: student.student_id,
        },
        data: {
            validated: true,
            discordCode: inviteCode,
        }
    })
    // const result = await prisma.students.findUnique({
    //     where: {
    //         student_id: student.student_id,
    //     }
    // })
    // console.log(result);

    let subject = "";
    let message = "";
    if (member.nationality == "Japan") {
      subject = "【Student Union】登録が完了しました";
      message = `
<p>${member.familyNameKanji} ${member.givenNameKanji} 様</p>
<p>
GLOMAC Student Union への登録が完了しました。<br>
コミュニティーへの参加に必要なDiscord招待リンクを別メールでお送りしました。<br>
こちらがDiscordの招待リンクになります。48時間以内にご登録ください。<br>
</p>
<p>
招待リンク：${inviteLink}<br>
Discordの登録方法は<a href="https://support.discord.com/hc/ja/articles/360034842871-%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%81%B8%E5%8F%82%E5%8A%A0%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF#h_01GZ2JD4P7CNPYQQ71ZPNSBQ3H">こちら</a><br>
招待リンクの再発行はできません。<br>
</p>
<p>
※本メールは送信専用のため、ご返信いただけません。<br>
※宛先が異なるなど、ご不明な点はヘルプデスクまでご連絡ください。<br>
※If this was not for you please contact us.<br>
</p>
<p>
━━━━━━━━━━━━━━━━<br>
発行：GLOMAC Student Union 運営委員<br>
＜ヘルプデスク＞<br>
${getUrl()}/support<br>
</p>
<p>
このメールの再配信および掲載記事の無断転載は禁止<br>
Copyright(C) All rights reserved.<br>
</p>
        `;
    } else {
      subject = "[Student Union] Registration Complete";
      message = `
<p>Hi ${member.givenName} ${member.familyName},</p>
<p>
Your registration with GLOMAC Student Union is complete.<br>
We have sent you a Discord Invite Link to join the community.<br>
This is your　Discord invite link. It is valid for 48 hours.<br>
</p>
<p>
INVITE LINK: ${inviteLink}<br>
Click <a href="https://support.discord.com/hc/en-us/articles/360034842871-How-do-I-join-a-Server">Official Webpage</a> for father information.<br>
This can be generated only once.<br>
</p>
<p>
※This is a send-only address, you cannot reply.<br>
※If this was not for you please contact us.<br>
※宛先が異なるなど、ご不明な点はヘルプデスクまでご連絡ください。<br>
</p>
<p>
━━━━━━━━━━━━━━━━<br>
Send by GLOMAC Student Union Committee<br>
[Help Desk]<br>
${getUrl()}/support<br>
</p>
<p>
このメールの再配信および掲載記事の無断転載は禁止<br>
Copyright(C) All rights reserved.<br>
</p>
        `;
    }

    await sendEmail(
      "Student Union",
      [userAccess.email, student.student_email],
      subject,
      message,
      message
    );

    const messageContent = `
**【ユーザー登録】** 
新たなユーザーが登録されました。
\`\`\`
Member Id：${userAccess.member_id.toString().padStart(6, "0") || "unknown"}
Name：${member.familyName} ${member.middleName ? `${member.middleName} ` : ""}${member.givenName}
ナマエ：${member.familyNamePho} ${member.middleNamePho ? `${member.middleNamePho} ` : ""}${member.givenNamePho}
\`\`\`
          `;

    const channelId = process.env.DISCORD_CHANNEL_ID_SIGNUP || "";
    await sendToDiscord(channelId, messageContent);

    return Response.json({ ok: true, message: "Discord invite send." });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ ok: false, message: `Unknown error` });
//   }
}
