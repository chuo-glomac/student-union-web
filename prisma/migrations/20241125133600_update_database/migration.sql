-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_member_id_fkey";

-- AlterTable
ALTER TABLE "Students" ALTER COLUMN "member_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Members"("member_id") ON DELETE SET NULL ON UPDATE CASCADE;
