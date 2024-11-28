"use server"
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type Validation = {
  createdAt: Date;
  studentId: string;
  chuoEmail: string;
  code: string;
  valid: 'TRUE' | 'FALSE';
  type?: number;
  email?: string;
};

export const action = async (data: Validation[], universityId: string, departmentId: number) => {
    try {
        // const { memberData } = await validateUser();
        // if (memberData.role < 2) {
        //     return { ok: false, message: 'Not Authorized.' }
        // }

        // Extract studentIds and chuoEmails from the incoming data
        const studentIds = data.map(item => item.studentId);
        const chuoEmails = data.map(item => item.chuoEmail);

        // Find existing records with the same studentId or chuoEmail
        const existingRecords = await prisma.students.findMany({
            where: {
                OR: [
                    { student_no: { in: studentIds } },
                    { student_email: { in: chuoEmails } },
                ],
            },
        });

        // Filter out existing records from the incoming data
        const existingStudentNos = existingRecords.map(record => record.student_no);
        const existingStudentEmails = existingRecords.map(record => record.student_email);
        // Separate the incoming data into unique and existing records
        const { uniqueData, existingData } = data.reduce((acc: any, item) => {
            if (existingStudentNos.includes(item.studentId) || existingStudentEmails.includes(item.chuoEmail)) {
                acc.existingData.push(item);
            } else {
                acc.uniqueData.push(item);
            }
            return acc;
        }, { uniqueData: [], existingData: [] });

        const updatedData = uniqueData.map((item: Validation) => ({
            student_no: item.studentId,
            student_email: item.chuoEmail,
            code: item.code,
            force: true,
            university_id: universityId,
            department_id: departmentId,
        }));
        const returnData = uniqueData.map((item: Validation) => ({
            student_no: item.studentId,
            student_email: item.chuoEmail,
            email: item.email || '',
            code: item.code,
        }));
        // console.log(data);

        if (updatedData.length > 0) {
            await prisma.students.createMany({
                data: updatedData,
            });
        }

        if (existingData.length > 0) {
            return { ok: false, message: 'Some or All of the Student ID or Email exist.', existingData }
        }

        return { ok: true, message: 'Upload Complete.', result: returnData }
    } catch (err) {
        console.log("error:", err);
        return { ok: false, message: 'Unkown error.' }
    }
}

export const getCode = async () => {
    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
    return code
}