"use server"
import { PrismaClient, Prisma } from "@prisma/client";
import { Validation } from "./page";
import crypto from "crypto";
import { validateUser } from "@/utils/supabase/auth";
const prisma = new PrismaClient();

export const action = async (data: Validation[]) => {
    try {
        const { memberData } = await validateUser();
        if (memberData.role < 2) {
            return { ok: false, message: 'Not Authorized.' }
        }

        // Extract studentIds and chuoEmails from the incoming data
        const studentIds = data.map(item => item.studentId);
        const chuoEmails = data.map(item => item.chuoEmail);

        // Find existing records with the same studentId or chuoEmail
        const existingRecords = await prisma.validation.findMany({
            where: {
                OR: [
                    { studentId: { in: studentIds } },
                    { chuoEmail: { in: chuoEmails } },
                ],
            },
        });

        // Filter out existing records from the incoming data
        const existingStudentIds = existingRecords.map(record => record.studentId);
        const existingChuoEmails = existingRecords.map(record => record.chuoEmail);
        // Separate the incoming data into unique and existing records
        const { uniqueData, existingData } = data.reduce((acc: any, item) => {
            if (existingStudentIds.includes(item.studentId) || existingChuoEmails.includes(item.chuoEmail)) {
                acc.existingData.push(item);
            } else {
                acc.uniqueData.push(item);
            }
            return acc;
        }, { uniqueData: [], existingData: [] });

        const updatedData = uniqueData.map((item: Validation) => ({
            createdAt: new Date(item.createdAt),
            studentId: item.studentId,
            chuoEmail: item.chuoEmail,
            code: item.code,
            valid: item.valid == "TRUE",
            type: 1,
        }));
        // console.log(data);

        if (updatedData.length > 0) {
            await prisma.validation.createMany({
                data: updatedData,
            });
        }

        if (existingData.length > 0) {
            return { ok: false, message: 'Some or All of the Student ID or Email exist.', existingData }
        }

        return { ok: true, message: 'Upload Complete.' }
    } catch (err) {
        console.log("error:", err);
        return { ok: false, message: 'Unkown error.' }
    }
}

export const getCode = async () => {
    const code = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
    return code
}