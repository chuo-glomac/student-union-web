/*
  Warnings:

  - You are about to drop the column `email_verified` on the `UserAccess` table. All the data in the column will be lost.
  - You are about to drop the column `student_verified` on the `UserAccess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAccess" DROP COLUMN "email_verified",
DROP COLUMN "student_verified",
ADD COLUMN     "email_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "student_confirmed_at" TIMESTAMP(3);
