import crypto from "crypto";


export async function sendCode(formData: FormData) {
  try {
    const studentId = formData.get("student-id") as string;
    const chuoEmail = formData.get("chuo-email") as string;
    if (studentId.substring(0, 2) != chuoEmail.substring(1, 3)) {
      alert("Please check Student ID and Chuo Email.");
      return;
    }

    const password = formData.get("password") as string;
    const passwordConf = formData.get("password-confirm") as string;
    if (password != passwordConf) {
      throw new Error("The password does not match.");
    }

    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
    // const confirmationCode = code.substring(0, 3) + "-" + code.substring(3, 6);

    // const country = formData.get("country") as string;
    let subject = "[GSU Protal] Registration Confirmation";
    let message = `
Hi,

Thank you for registering for GLOMAC Student Union.
Please use the following code to confirm your identity.

Confirmation Code：${code}
Valid for 30 minutes.

※This is a send-only address, you cannot reply.
※If this was not for you please contact us.
※宛先が異なるなど、ご不明な点はヘルプデスクまでご連絡ください。

━━━━━━━━━━━━━━━━
Send by GLOMAC Student Union Committee
[Help Desk]
${getUrl()}support

このメールの再配信および掲載記事の無断転載は禁止
Copyright(C) All rights reserved.
      `;

    const matchingValidations = await prisma.validation.findMany({
      where: {
        OR: [{ studentId }, { chuoEmail }],
      },
      include: {
        member: true, // Include the related member data
      },
    });

    let retry = 0;
    if (matchingValidations.length > 0) {
      // console.log('Matching validation records:', matchingValidations);
      const recordsForced = matchingValidations.filter(
        (validation) => validation.type == 1
      );
      const recordsWithoutMember = matchingValidations.filter(
        (validation) => validation.member === null
      );

      if (recordsForced.length > 0) {
        console.log(
          `Cannot override validation. Force validation data is included.`
        );
        throw new Error(
          "This student ID and chuo email is not allow on this page. \nこの学籍番号または全学メールはこのページでは使用できません。"
        );
      }

      if (recordsWithoutMember.length > 0) {
        console.log("Override validation:", recordsWithoutMember);

        await prisma.validation.deleteMany({
          where: {
            AND: [
              {
                OR: [{ studentId }, { chuoEmail }],
              },
              {
                type: 0,
              },
              {
                member: {
                  is: null,
                },
              },
            ],
          },
        });
        retry = matchingValidations[0].count + 1;
      } else {
        console.log(
          `Cannot override validation. Member is linked to ${matchingValidations.length} data.`
        );
        throw new Error(
          "Either or both Student ID and Chuo Email is used. \nこの学籍番号または全学メールは使用されています。"
        );
      }
    }

    // add user info to database (unverified)
    await prisma.validation.create({
      data: {
        studentId,
        chuoEmail,
        code,
        count: retry,
      },
    });

    // send code to user
    await sendGmail("GLOMAC Student Union", [chuoEmail], subject, message);
    // console.log("confirmation code:", code);
    // console.log(formData);

    // const email = formData.get("email") as string;
    // await signup(email, password);

    return "form submitted";
  } catch (err) {
    console.log(err);
    throw new Error((err as string) || "");
  }
}