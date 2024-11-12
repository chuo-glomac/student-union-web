/*
  Warnings:

  - The `receiver_id` column on the `Emails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `Profiles` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Students` table. All the data in the column will be lost.
  - The `sender_id` column on the `Supports` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[member_id]` on the table `Students` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `sender_id` on the `Emails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `member_id` to the `Profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `Students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Emails" DROP CONSTRAINT "Emails_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "Emails" DROP CONSTRAINT "Emails_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Supports" DROP CONSTRAINT "Supports_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_user_id_fkey";

-- DropIndex
DROP INDEX "Students_user_id_key";

-- AlterTable
ALTER TABLE "Emails" DROP COLUMN "sender_id",
ADD COLUMN     "sender_id" INTEGER NOT NULL,
DROP COLUMN "receiver_id",
ADD COLUMN     "receiver_id" INTEGER;

-- AlterTable
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "member_id" INTEGER NOT NULL,
ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY ("member_id");

-- AlterTable
ALTER TABLE "Students" DROP COLUMN "user_id",
ADD COLUMN     "member_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Supports" DROP COLUMN "sender_id",
ADD COLUMN     "sender_id" INTEGER;

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "Members" (
    "member_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyName" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "middleName" TEXT,
    "familyNamePho" TEXT NOT NULL,
    "givenNamePho" TEXT NOT NULL,
    "middleNamePho" TEXT,
    "familyNameKanji" TEXT,
    "givenNameKanji" TEXT,
    "middleNameKanji" TEXT,
    "birthOfDate" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "newsLetter" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("member_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Members_user_id_key" ON "Members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Students_member_id_key" ON "Students"("member_id");

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserAccess"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supports" ADD CONSTRAINT "Supports_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Members"("member_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Members"("member_id") ON DELETE SET NULL ON UPDATE CASCADE;
