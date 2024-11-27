"use server";
import { sendEmail } from "@/utils/sendEmail";
import sendToDiscord from "@/utils/sendToDiscord";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    await sendToDiscord(channelId, messageContent);
  
    const message = `
Thank you for submitting the Support Form.
ヘルプデスクへのご連絡ありがとうございます。

[Content]
Subject: ${subject}
Body: ${body}
Contact Id: ${supportId.toString().padStart(6, "0")}
    `;
  
    await sendEmail(
      "Student Union [Support Form]",
      [email],
      "Thank you for submitting the Support Form",
      message
    );
  
    // console.log("form sent");
    // console.log(formData);
  }
  