/*
  Warnings:

  - You are about to drop the column `count_friends` on the `Profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profiles" DROP COLUMN "count_friends",
ADD COLUMN     "count_friend" INTEGER NOT NULL DEFAULT 0;
