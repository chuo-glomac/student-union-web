/*
  Warnings:

  - Added the required column `university_id` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "university_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Universities" (
    "university_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Universities_pkey" PRIMARY KEY ("university_id")
);

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "Universities"("university_id") ON DELETE RESTRICT ON UPDATE CASCADE;
