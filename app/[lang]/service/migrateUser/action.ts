"use server";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userMap = async () => {
  const fileContent = await fs.readFile(
    "/Users/kaiseisawada/Desktop/app/student-union-web/_archive/user_id.json",
    "utf-8"
  );
  const convertDataSet = JSON.parse(fileContent);

  const userAccess = await prisma.userAccess.findMany();

  const mapping = [];
  for (const data of convertDataSet) {
    const new_user_id = data.new_user_id;
    const matchData = userAccess.find(
      (row) => row.user_id === data.new_user_id
    );
    if (!matchData) {
      mapping.push({
        new_user_id,
        old_user_id: data.old_user_id,
        ok: false,
        message: "No match data.",
      });
    }

    mapping.push({
      new_user_id,
      old_user_id: data.old_user_id,
      email: matchData?.email,
      ok: true,
    });
  }

  await writeMappingToFile("user_id_with_email.json", mapping);
};

export const updateMember = async (user: any) => {
  const fileContent = await fs.readFile(
    "/Users/kaiseisawada/Desktop/app/student-union-web/_archive/user_id_with_email.json",
    "utf-8"
  );
  const userIds = JSON.parse(fileContent);
  // console.log(userIds);

  const {
    id,
    createdAt,
    uuid,
    email,
    year,
    familyName,
    givenName,
    middleName,
    familyNamePho,
    givenNamePho,
    middleNamePho,
    familyNameKanji,
    givenNameKanji,
    middleNameKanji,
    birthOfDate,
    nationality,
    phoneNumber,
    status,
    role,
    discordCode,
    studentId,
    newsLetter,
  } = user;
  // console.log("uuid:", uuid);

  // console.log(userIds[0]);
  const matchData = userIds.find((row: any) => {
    if (!row || !row.old_user_id) {
      return false;
    }
    return row.old_user_id === uuid; // Corrected logic
  });

  // console.log("new_user_id:", matchData);
  if (!matchData || !matchData.new_user_id) {
    return {
      studentId,
      email,
      ok: false,
      message: "cannot find user_id.",
    };
  }

  const userAccess = await prisma.userAccess.findUnique({
    where: {
      user_id: matchData.new_user_id,
    },
  });
  if (!userAccess) {
    return {
      studentId,
      email,
      ok: false,
      message: "cannot find userAccess.",
    };
  }

  const date = new Date(birthOfDate);
  date.setUTCDate(date.getUTCDate() + 1);
  const isoString = date.toISOString();
  const formattedDate = isoString.split("T")[0] + "T09:00:00";

  const data = await prisma.members.create({
    data: {
      member_id: userAccess?.member_id,
      created_at: new Date(createdAt),
      updated_at: new Date(),
      familyName,
      givenName,
      middleName: middleName || null,
      familyNamePho,
      givenNamePho,
      middleNamePho: middleNamePho || null,
      familyNameKanji: familyNameKanji || null,
      givenNameKanji: givenNameKanji || null,
      middleNameKanji: middleNameKanji || null,
      birthOfDate: new Date(formattedDate),
      nationality,
      phoneNumber,
      newsLetter: newsLetter === "true",
    },
  });

  return {
    member_id: userAccess.member_id,
    studentId,
    email,
    discordCode,
  };
};

export const updateStudent = async (data: any) => {
  const fileContent = await fs.readFile(
    "/Users/kaiseisawada/Desktop/app/student-union-web/_archive/member_student_mapping.json",
    "utf-8"
  );
  const convertDataSet = JSON.parse(fileContent);

  const {
    id,
    createdAt,
    validateAt,
    studentId,
    chuoEmail,
    code,
    valid,
    type,
    count,
  } = data;
  if (!studentId) {
    return {
      studentId: "unknown",
      ok: false,
      messsage: "Cannot find convert data.",
    };
  }

  const convertData = convertDataSet.find((member: any) => {
    if (!member || !member.studentId) {
      return false;
    }
    return member.studentId === studentId;
  });
  if (!convertData || !convertData.member_id) {
    return { studentId, ok: false, messsage: "Cannot find convert data." };
  }

  const member = await prisma.members.findUnique({
    where: {
      member_id: convertData.member_id,
    },
  });
  if (!member) {
    return { studentId, ok: false, messsage: "Cannot find member." };
  }

  const student = await prisma.students.create({
    data: {
      created_at: new Date(createdAt),
      student_no: studentId,
      student_email: chuoEmail,
      code,
      validated: valid === "true",
      member_id: member.member_id,
      send_count: parseInt(count, 10),
      university_id: "chuo-university",
      department_id: 1,
      discordCode: convertData.discordCode,
      force: parseInt(type, 10) === 1,
    },
  });

  return { studentId, ok: true };
};

export const writeMappingToFile = async (filename: string, mapping: any[]) => {
  console.log(mapping);
  const filePath = path.join(
    "/Users/kaiseisawada/Desktop/app/student-union-web/_archive/",
    filename
  );

  await fs.writeFile(filePath, JSON.stringify(mapping, null, 2), "utf-8");
  console.log(`Mapping saved to ${filePath}`);
};
