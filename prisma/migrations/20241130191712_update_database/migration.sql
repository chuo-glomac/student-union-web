-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "count_friends" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "count_post" INTEGER NOT NULL DEFAULT 0;
