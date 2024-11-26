import { getUrl } from "@/utils/getUrl";
import { PrismaClient, Prisma } from "@prisma/client";
import { ErrorBoundaryHandler } from "next/dist/client/components/error-boundary";
import { sendEmail } from "@/utils/sendEmail";
import sendToDiscord from "@/utils/sendToDiscord";
const prisma = new PrismaClient();

export async function GET() {
    return Response.json({ ok: false });
  }

export async function POST(req: Request) {
  try {
    const { email, temporary_id, formData } = await req.json();
    console.log(email, temporary_id, formData);

    const userAccess = await prisma.userAccess.findUnique({
      where: {
        email,
        temporary_id,
      },
    });
    if (!userAccess) {
      return Response.json({ ok: false, message: "No match user." });
    }

    const country = formData.country as string;

    const familyName = formData.familyName as string;
    const givenName = formData.givenName as string;
    const familyNameKanji =
      (formData["familyName-kanji"] as string) || null;
    const givenNameKanji = (formData["givenName-kanji"] as string) || null;

    let memberNewData: Prisma.MembersUncheckedCreateInput = {
      member_id: userAccess.member_id,
      familyName,
      givenName,
      familyNamePho: formData["familyName-pho"] as string,
      givenNamePho: formData["givenName-pho"] as string,
      familyNameKanji,
      givenNameKanji,
      birthOfDate: new Date(formData["birthOfDate"] as string),
      nationality: country,
      phoneNumber: formData["phone"] as string,
      newsLetter: (formData["newsLetter"] as string) == "on" || false,
    };

    const middleName = formData["middleName"] as string;
    const middleNamePho = formData["middleName-pho"] as string;
    if (middleName && middleNamePho) {
      memberNewData.middleName = middleName;
      memberNewData.middleNamePho = middleNamePho;

      const middleNameKanji =
        (formData["middleName-kanji"] as string) || "";
      if (familyNameKanji && givenNameKanji && middleNameKanji) {
        memberNewData.middleNameKanji = middleNameKanji;
      }
    }

    const memberResult = await prisma.members.create({
      data: memberNewData,
    });

//     const messageContent = `
//   **【ユーザー登録】** 
//   新たなユーザーが登録されました。
//   \`\`\`
//   Member Id：${userAccess.member_id.toString().padStart(6, "0") || "unknown"}
//   Name：${formData.get("familyName") as string} ${
//       (formData.get("middleName") as string)
//         ? `${formData.get("middleName") as string} `
//         : ""
//     }${formData.get("givenName") as string}
//   ナマエ：${formData.get("familyName-pho") as string} ${
//       (formData.get("middleName-pho") as string)
//         ? `${formData.get("middleName-pho") as string} `
//         : ""
//     }${formData.get("givenName-pho") as string}
//   \`\`\`
//           `;

    // const channelId = process.env.DISCORD_CHANNEL_ID_SIGNUP || "";
    // await sendToDiscord(channelId, messageContent);

    console.log(memberResult);
    return Response.json({ ok: true, message: "Member info registered." });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, message: `Uknown error: ${err}` });
  }
}
