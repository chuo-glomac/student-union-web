-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserAccess"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
