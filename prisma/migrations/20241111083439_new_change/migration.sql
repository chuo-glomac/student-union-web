/*
  Warnings:

  - The `email_verified` column on the `UserAccess` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `student_verified` column on the `UserAccess` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserAccess" DROP COLUMN "email_verified",
ADD COLUMN     "email_verified" TIMESTAMP(3),
DROP COLUMN "student_verified",
ADD COLUMN     "student_verified" TIMESTAMP(3);
