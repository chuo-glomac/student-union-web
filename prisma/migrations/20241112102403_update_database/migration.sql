/*
  Warnings:

  - The primary key for the `Universities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `university_id` to the `Departments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_university_id_fkey";

-- AlterTable
ALTER TABLE "Departments" ADD COLUMN     "university_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Students" ALTER COLUMN "university_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Universities" DROP CONSTRAINT "Universities_pkey",
ALTER COLUMN "university_id" DROP DEFAULT,
ALTER COLUMN "university_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Universities_pkey" PRIMARY KEY ("university_id");
DROP SEQUENCE "Universities_university_id_seq";

-- AddForeignKey
ALTER TABLE "Departments" ADD CONSTRAINT "Departments_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "Universities"("university_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "Universities"("university_id") ON DELETE RESTRICT ON UPDATE CASCADE;
