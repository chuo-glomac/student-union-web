/*
  Warnings:

  - Added the required column `department_id` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "department_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Departments" (
    "department_id" SERIAL NOT NULL,
    "faculty_name" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "major_name" TEXT,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("department_id")
);

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;
