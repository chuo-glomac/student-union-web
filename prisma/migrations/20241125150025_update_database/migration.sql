/*
  Warnings:

  - Added the required column `discordCode` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_member_id_fkey";

-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "discordCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;
