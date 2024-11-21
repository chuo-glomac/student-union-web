/*
  Warnings:

  - You are about to drop the column `user_id` on the `Members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[member_id]` on the table `UserAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Members" DROP CONSTRAINT "Members_user_id_fkey";

-- DropIndex
DROP INDEX "Members_user_id_key";

-- AlterTable
ALTER TABLE "Members" DROP COLUMN "user_id",
ALTER COLUMN "member_id" DROP DEFAULT;
DROP SEQUENCE "Members_member_id_seq";

-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "member_id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_member_id_key" ON "UserAccess"("member_id");

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "UserAccess"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;
