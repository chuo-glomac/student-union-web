/*
  Warnings:

  - You are about to drop the column `trial_send` on the `Students` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Students" DROP COLUMN "trial_send",
ADD COLUMN     "send_count" INTEGER NOT NULL DEFAULT 0;
