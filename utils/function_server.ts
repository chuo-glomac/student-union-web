"use server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { getUrl } from "@/utils/getUrl";
const supabase = createClient();
const prisma = new PrismaClient();

import nodemailer from "nodemailer";
export const sendGmail = async (
  senderName: string,
  emails: string[],
  subject: string,
  text: string,
  html?: string
) => {
  const mail = process.env.MAIL_ACCOUNT;
  const pass = process.env.MAIL_PASSWORD;

  if (!mail || !pass) {
    console.error("Missing email credentials");
    return;
  }

  // const transporter = nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     user: mail,
  //     pass: pass,
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: mail,
      pass: pass,
    },
  });

  const emailStr = emails.join(", ");

  try {
    let message = {};
    if (html) {
      message = {
        from: `${senderName} <${mail}>`,
        bcc: emailStr,
        subject,
        text,
        html,
      };
    } else {
      message = {
        from: `${senderName} <${mail}>`,
        bcc: emailStr,
        subject,
        text,
      };
    }

    const info = await transporter.sendMail(message);
    console.log("Message sent:", info);

  } catch (error) {
    console.error("Failed to send email: ", error);
  }

  // console.log("finish");
};

export const sendGmailWithId = async (
  senderName: string,
  senderId: number,
  id: number,
  subject: string,
  text: string,
  html?: string
) => {
  let emails: string[] = [];
  const member = await prisma.members.findUnique({
    where: {
      member_id: id
    },
    include: {
      user_access: {
        select: {
          email: true,
        },
      },
    }
  });
  if (member && member.user_access.email) {
    emails.push(member.user_access.email);
  } else {
    return;
  }

  const emailData = await prisma.emails.create({
    data: {
      sender_id: senderId,
      receiver_id: member.member_id,
      reciever_email: member.user_access.email,
      subject: subject,
      content: text,
    }
  })

  const name = `${member?.familyName} ${member?.middleName ? `${member.middleName} ` : ""}${member?.givenName}`
  const formattedSenderName = `"${senderName}" from GSU`
  const formattedSubject = `"${subject}" from GSU`
  const formattedBody = `
You have a message from GSU Council.
GSU運営委員よりメッセージが届いています。

ーーーーーーーーーーーーーーーーーーーーー
To: ${name} (ID: ${emailData.receiver_id})
Subject: ${subject}

${text}
ーーーーーーーーーーーーーーーーーーーーー
email-id: ${emailData.email_id.toString().padStart(6, "0")}

※本メールは送信専用のため、ご返信いただけません。
※宛先が異なるなど、ご不明な点はヘルプデスクまでご連絡ください。
※If this was not for you please contact us.

━━━━━━━━━━━━━━━━
Send by GLOMAC Student Union Council
[Help Desk]
${getUrl()}support

このメールの再配信および掲載記事の無断転載は禁止
Copyright(C) All rights reserved.
  `

  if (html) {
    await sendGmail(formattedSenderName, emails, formattedSubject, formattedBody, html);
  } else {
    await sendGmail(formattedSenderName, emails, formattedSubject, formattedBody);
  }
};

// `
// **Bold Text**
// *Italic Text*
// ***Bold and Italic Text***
// ~~Strikethrough Text~~
// __Underline Text__
// \`Inline Code\`
// \`\`\`
// Code Block
// \`\`\`
// > Block Quote
// ||Spoiler Text||
// - List Item 1
// - List Item 2
// 1. Ordered Item 1
// 2. Ordered Item 2
// [OpenAI](https://www.openai.com)
// `
export async function sendToDiscord(channelId: string, messageContent: string) {
  const response = await fetch(
    `https://discord.com/api/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: messageContent,
      }),
    }
  );

  const data = await response.json();
  // console.log(data);

  return data;
}

export async function supportForm(formData: FormData) {
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  const supportData = await prisma.supports.create({
    data: {
      sender_email: email,
      subject,
      content: body,
    },
  });
  const supportId = supportData.support_id;

  const messageContent = `
**【ヘルプデスク】** contactId: ${supportId}
新しいフォームが送信されました。

件名：${subject}
\`\`\`
${body}
\`\`\`
    `;

  const channelId = process.env.DISCORD_CHANNEL_ID_SUPPORT || "";
  const result = await sendToDiscord(channelId, messageContent);

  const message = `
Thank you for submitting the Support Form.
ヘルプデスクへのご連絡ありがとうございます。

[Content]
Subject: ${subject}
Body: ${body}
Contact Id: ${supportId.toString().padStart(6, "0")}
  `;

  await sendGmail(
    "Student Union [Support Form]",
    [email],
    "Thank you for submitting the Support Form",
    message
  );

  // console.log("form sent");
  // console.log(formData);
}

// new code
import crypto from "crypto";
export async function sendCode(formData: FormData) {
  try {
    const studentNo = formData.get("student-no") as string;
    const studentEmail = formData.get("student-email") as string;
    if (studentNo.substring(0, 2) != studentEmail.substring(1, 3)) {
      alert("Please check Student ID and Chuo Email.");
      return;
    }

    const password = formData.get("password") as string;
    const passwordConf = formData.get("password-confirm") as string;
    if (password != passwordConf) {
      throw new Error("The password does not match.");
    }

    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    let subject = "【Student Union】在籍確認のご連絡";
    let message = `
Hi,

大学メールアドレスを使った在籍確認をお願いします。
以下のコードを確認画面に入力してください。

認証コード：${code}
有効期限：30分

※宛先が異なるなど、ご不明な点はヘルプデスクまでご連絡ください。

━━━━━━━━━━━━━━━━
Send by Student Union Committee
[Help Desk]
${getUrl()}support

このメールの再配信および掲載記事の無断転載は禁止
Copyright(C) All rights reserved.
      `;

    const matchingValidations = await prisma.students.findMany({
      where: {
        OR: [{ student_no: studentNo }, { student_email: studentEmail }],
      },
      include: {
        member: true,
      },
    });

    if (matchingValidations.length > 0) {
      // console.log('Matching validation records:', matchingValidations);
      const recordsForced = matchingValidations.filter(
        (student) => student.force === true
      );
      const recordsWithoutMember = matchingValidations.filter(
        (student) => student.member === null
      );

      if (recordsForced.length > 0) {
        console.log(
          `Cannot override validation. Force validation data is included.`
        );
        // throw new Error(
        //   "This student ID and chuo email is not allow on this page. \nこの学籍番号または全学メールはこのページでは使用できません。"
        // );
        return { ok: true, force: true };
      }

      if (recordsWithoutMember.length > 0) {
        console.log("Override validation:", recordsWithoutMember);

        await prisma.students.update({
          where: {
            student_email: studentEmail
          },
          data: {
            code,
            trial_count: { increment: 1 },
            trial_send: 0
          },
        });
      } else {
        console.log(
          `Cannot override validation. Member is linked to ${matchingValidations.length} data.`
        );
        throw new Error(
          "Either or both Student ID and Chuo Email is used. \nこの学籍番号または全学メールは使用されています。"
        );
      }
    } else {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();

      const member = await prisma.members.findUnique({
        where: { user_id: data.user?.id }
      })

      if (member) {
        await prisma.students.create({
          data: {
            member_id: member?.member_id,
            student_no: studentNo,
            student_email: studentEmail,
            code,
          },
        });
      } else {
        throw new Error("Cannot find member data.")
      }
    }

    // send code to user
    await sendGmail("Student Union", [studentEmail], subject, message);
    // console.log("confirmation code:", code);
    // console.log(formData);

    // const email = formData.get("email") as string;
    // await signup(email, password);

    return { ok: true, force: false };
  } catch (err) {
    console.log(err);
    throw new Error((err as string) || "");
  }
}

export async function verifyCode(chuoEmail: string, code: string) {
  try {
    const student = await prisma.students.findUnique({
      where: { student_email: chuoEmail },
    });

    const now = new Date().toISOString();
    if (!student) {
      return { ok: false, message: "Cannot find validation." }
      // return false;
    }
    const createdAt = new Date(student.created_at).toISOString();
    const diffInMinutes = (new Date(now).getTime() - new Date(createdAt).getTime()) / (1000 * 60);
    if (diffInMinutes > 45 && student.force === false) {
      console.log("Code has expired.")
      return { ok: false, message: "Code has expired." }
    }

    if (student?.trial_send > 3) {
      return { ok: false, message: "Validation over limit. (3 times)" }
    }

    if (student?.code === code) {
      await prisma.students.update({
        where: { student_email: chuoEmail },
        data: {
          validated: true,
        },
      });
      return { ok: true, message: "Validation success." }
      // return true;
    } else {
      await prisma.students.update({
        where: { student_email: chuoEmail },
        data: {
          trial_send: { increment: 1 },
        },
      });
      return { ok: false, message: "Code doesn't match." }
      // return false;
    }
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Unknown error." }
    // return false;
  }
}

import { createInvite } from "@/utils/discord_invite";
import { validateUserServer } from "./supabase/auth";
import { redirect } from "next/navigation";
export async function saveFinalForm(formData: FormData) {
  try {
    const studentNo = formData.get("student-no") as string;
    const studentEmail = formData.get("student-email") as string;

    const student = await prisma.students.findUnique({
      where: { student_no: studentNo, student_email: studentEmail },
    });

    if (!student || !student.validated) {
      return { ok: false, message: "Validation not completed or invalid." }
      // throw new Error("Validation not completed or invalid.");
    }

    const password = formData.get("password") as string;
    const passwordConf = formData.get("password-confirm") as string;
    if (password != passwordConf) {
      return { ok: false, message: "The password does not match." }
      // throw new Error("The password does not match.");
    }
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!pattern.test(password)) {
      return { ok: false, message: "The password misses character." }
      // throw new Error("The password misses character.");
    }

    const email = (formData.get("email") as string).toLowerCase();
    const userData = {
      email,
      password,
    };

    // const { data, error } = await supabase.auth.signUp(userData);
    // if (error || !data || !data.user) {
    //   console.log(error);
    //   return { ok: false, message: "Unknown error signing up." }
    //   // throw new Error("Cannot SignUp");
    // }

    const country = formData.get("country") as string;
    const { inviteLink, code } = await createInvite();

    // const uuid = data.user.id;
    const year = 2000 + Number(studentNo.substring(0, 2)) || 2000;

    const familyName = formData.get("familyName") as string;
    const givenName = formData.get("givenName") as string;
    const familyNameKanji =
      (formData.get("familyName-kanji") as string) || null;
    const givenNameKanji = (formData.get("givenName-kanji") as string) || null;

    let memberNewData: any = {
      uuid,
      email,
      year,
      familyName,
      givenName,
      familyNamePho: formData.get("familyName-pho") as string,
      givenNamePho: formData.get("givenName-pho") as string,
      familyNameKanji,
      givenNameKanji,
      birthOfDate: new Date(formData.get("birthOfDate") as string),
      nationality: country,
      phoneNumber: formData.get("phone") as string,
      discordCode: code,
      status: 2,
      newsLetter: formData.get("newsLetter") as string == "on" || false,
    };

    const middleName = formData.get("middleName") as string;
    const middleNamePho = formData.get("middleName-pho") as string;
    if (middleName && middleNamePho) {
      memberNewData.middleName = middleName;
      memberNewData.middleNamePho = middleNamePho;

      const middleNameKanji =
        (formData.get("middleName-kanji") as string) || "";
      if (familyNameKanji && givenNameKanji && middleNameKanji) {
        memberNewData.middleNameKanji = middleNameKanji;
      }
    }

    const memberResult = await prisma.member.create({
      data: memberNewData,
    });

    // Optionally, you can send a confirmation email here
    let subject = "";
    let message = "";
    if (country == "Japan") {
      subject = "【GSU Protal】登録が完了しました";
      message = `
<p>${familyNameKanji} ${givenNameKanji} 様</p>
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
${getUrl()}support<br>
</p>
<p>
このメールの再配信および掲載記事の無断転載は禁止<br>
Copyright(C) All rights reserved.<br>
</p>
        `;
    } else {
      subject = "[GSU Protal] Registration Complete";
      message = `
<p>Hi ${givenName} ${familyName},</p>
<p>
Your registration with GLOMAC Student Union is complete.<br>
We have sent you a Discord Invite Link to join the community.<br>
This is your　Discord invite link. It is valid for 48 hours.<br>
</p>
<p>
INVITE LINK: ${inviteLink}<br>
Check <a href="https://support.discord.com/hc/en-us/articles/360034842871-How-do-I-join-a-Server">Official Webpage</a> for father information.<br>
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
${getUrl()}support<br>
</p>
<p>
このメールの再配信および掲載記事の無断転載は禁止<br>
Copyright(C) All rights reserved.<br>
</p>
        `;
    }

    await sendGmail(
      "GLOMAC Student Union",
      [formData.get("email") as string],
      subject,
      message,
      message
    );

    const messageContent = `
**【ユーザー登録】** 
新たなユーザーが登録されました。
\`\`\`
ID：${memberResult.id.toString().padStart(6, "0") || "unknown"}
Name：${formData.get("familyName") as string} ${(formData.get("middleName") as string)
        ? `${formData.get("middleName") as string} `
        : ""
      }${formData.get("givenName") as string}
ナマエ：${formData.get("familyName-pho") as string} ${(formData.get("middleName-pho") as string)
        ? `${formData.get("middleName-pho") as string} `
        : ""
      }${formData.get("givenName-pho") as string}
\`\`\`
        `;

    const channelId = process.env.DISCORD_CHANNEL_ID_SIGNUP || "";
    const result = await sendToDiscord(channelId, messageContent);

    console.log(memberNewData)
    return "Form submitted and saved successfully";
  } catch (err) {
    console.error(err);
    throw new Error((err as string) || "");
  }
}

import { format } from "date-fns";
async function getMembers(role: number = 0) {
  try {
    // const result = await validateUserMember();
    // if (!result.ok) return { ok: false, message: result.message };

    // const { memberData } = result;
    // if (role == 0) {
    //   return { ok: false, message: 'Not allowed' };
    // }
    let members: any;
    if (role == 1) {
      members = await prisma.member.findMany({
        where: {
          status: 2,
        },
        select: {
          id: true,
          createdAt: true,
          year: true,
          familyName: true,
          givenName: true,
          middleName: true,
          familyNamePho: true,
          givenNamePho: true,
          middleNamePho: true,
          familyNameKanji: true,
          givenNameKanji: true,
          middleNameKanji: true,
          birthOfDate: true,
          nationality: true,
          role: true,
          discordCode: false,
          studentId: true,
        },
      });

      const formattedMembers = members.map((member: any) => ({
        ...member,
        email: "******@****.***",
        phoneNumber: "******",
        status: "**",
        discordCode: "********",
      }));

      return { ok: true, members: formattedMembers };
    }
    if (role == 2) {
      members = await prisma.member.findMany({
        where: {
          status: 2,
        },
      });
      return { ok: true, members: members };
    }

    return { ok: false, message: "Unknown error." };
  } catch (err) {
    console.log(err);
    return { ok: false, message: err };
  }
}

async function getValidationData(role: number = 0) {
  try {
    let validationDatas: any;
    if (role == 1) {
      validationDatas = await prisma.validation.findMany({
        select: {
          id: true,
          createdAt: true,
          studentId: true,
          chuoEmail: false,
          code: false,
          valid: true,
          count: true,
        },
      });
      return { ok: true, validationDatas };
    }
    if (role == 2) {
      validationDatas = await prisma.validation.findMany({
        select: {
          id: true,
          createdAt: true,
          studentId: true,
          chuoEmail: true,
          code: true,
          valid: true,
          count: true,
        },
      });

      return { ok: true, validationDatas };
    }

    return { ok: false, message: "Unknown error." };
  } catch (err) {
    console.log(err);
    return { ok: false, message: err };
  }
}

export async function getFullData() {
  try {
    const result = await validateUserServer();
    if (!result.ok) return { ok: false, message: result.message };

    const { memberData } = result;
    if (memberData.role == 0) {
      return { ok: false, message: "Not allowed" };
    }

    const { members } = await getMembers(memberData.role);
    const { validationDatas } = await getValidationData(memberData.role);

    const updateMembers = members.map((member: any, index: number) => {
      const validationInfo = validationDatas.filter(
        (data: any) => data.studentId === member.studentId
      )[0];

      return {
        ...member,
        index: index + 1,
        name: `${member.familyName} ${member.middleName ? `${member.middleName} ` : ""
          }${member.givenName}`,
        namePho: `${member.familyNamePho} ${member.middleNamePho ? `${member.middleNamePho} ` : ""
          }${member.givenNamePho}`,
        nameKanji:
          `${member.familyNameKanji} ${member.middleNameKanji ? `${member.middleNameKanji} ` : ""
          }${member.givenNameKanji}` || "",
        validationInfo,
      };
    });
    // console.log(updateMembers);

    return { ok: true, updateMembers };
  } catch (err) {
    console.log(err);
    return { ok: false, message: err };
  }
}
