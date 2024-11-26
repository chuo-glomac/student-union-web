/*
  Warnings:

  - Made the column `member_id` on table `Students` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_member_id_fkey";

-- AlterTable
ALTER TABLE "Students" ALTER COLUMN "member_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;
