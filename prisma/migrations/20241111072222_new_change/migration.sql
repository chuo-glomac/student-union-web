-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
