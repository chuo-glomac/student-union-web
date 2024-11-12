-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('VALIDATING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN', 'GUEST');

-- CreateTable
CREATE TABLE "UserAccess" (
    "user_id" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'VALIDATING',
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Users" (
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
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
    "newsLetter" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Students" (
    "student_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_no" TEXT NOT NULL,
    "student_email" TEXT NOT NULL,
    "date_of_entry" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "validated_at" TIMESTAMP(3),
    "trial_count" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "username" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "social_media" JSONB NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT 'default/default_male01.jpg',

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Supports" (
    "support_id" SERIAL NOT NULL,
    "sender_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "sender_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Supports_pkey" PRIMARY KEY ("support_id")
);

-- CreateTable
CREATE TABLE "Emails" (
    "email_id" SERIAL NOT NULL,
    "original_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT,
    "reciever_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Emails_pkey" PRIMARY KEY ("email_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Students_student_no_key" ON "Students"("student_no");

-- CreateIndex
CREATE UNIQUE INDEX "Students_student_email_key" ON "Students"("student_email");

-- CreateIndex
CREATE UNIQUE INDEX "Students_user_id_key" ON "Students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_username_key" ON "Profiles"("username");

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supports" ADD CONSTRAINT "Supports_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
