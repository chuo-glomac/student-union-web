/*
  Warnings:

  - You are about to drop the column `email` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `UserAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "email",
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_email_key" ON "UserAccess"("email");
