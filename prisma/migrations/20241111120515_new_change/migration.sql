/*
  Warnings:

  - You are about to drop the column `validated_at` on the `Students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Students" DROP COLUMN "validated_at",
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserAccess"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
