-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "student_verified" BOOLEAN NOT NULL DEFAULT false;
