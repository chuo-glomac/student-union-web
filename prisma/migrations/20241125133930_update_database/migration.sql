-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_member_id_fkey";

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "UserAccess"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;
