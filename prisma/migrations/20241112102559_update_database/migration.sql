/*
  Warnings:

  - You are about to drop the column `department_name` on the `Departments` table. All the data in the column will be lost.
  - You are about to drop the column `faculty_name` on the `Departments` table. All the data in the column will be lost.
  - You are about to drop the column `major_name` on the `Departments` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Universities` table. All the data in the column will be lost.
  - Added the required column `department_name_en` to the `Departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty_name_en` to the `Departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Universities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_jp` to the `Universities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Departments" DROP COLUMN "department_name",
DROP COLUMN "faculty_name",
DROP COLUMN "major_name",
ADD COLUMN     "department_name_en" TEXT NOT NULL,
ADD COLUMN     "department_name_jp" TEXT,
ADD COLUMN     "faculty_name_en" TEXT NOT NULL,
ADD COLUMN     "faculty_name_jp" TEXT,
ADD COLUMN     "major_name_en" TEXT,
ADD COLUMN     "major_name_jp" TEXT;

-- AlterTable
ALTER TABLE "Universities" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_jp" TEXT NOT NULL;
