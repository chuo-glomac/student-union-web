type resultProp = {
    ok: boolean,
    message?: string
}

type studentProp = {
    studentNo: string,
    studentEmail: string,
    department: string,
    faculty: string
}

export default function validateStudent(universityId: string, studentData: studentProp): resultProp {
    let result: { ok: boolean, message?: string };
    if (universityId === "chuo-university") {
        result = chuo_university(studentData);
    }

    return { ok: false, message: "University not found." }
}

function chuo_university(studentData: studentProp): resultProp {
    if (studentData.studentNo.substring(0, 2) != studentData.studentNo.substring(1, 3)) {
        return { ok: false, message: "Please check Student ID and Chuo Email." };
    }

    return { ok: true };
}

