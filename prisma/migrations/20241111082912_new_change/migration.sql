/*
  Warnings:

  - The values [REGISTERED,EMAIL_VERIFIED,STUDENT_VERIFIED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('VALIDATING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');
ALTER TABLE "UserAccess" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserAccess" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "UserAccess" ALTER COLUMN "status" SET DEFAULT 'VALIDATING';
COMMIT;
