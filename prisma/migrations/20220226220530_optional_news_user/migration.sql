-- DropForeignKey
ALTER TABLE "InstituteNews" DROP CONSTRAINT "InstituteNews_user_id_fkey";

-- AlterTable
ALTER TABLE "InstituteNews" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InstituteNews" ADD CONSTRAINT "InstituteNews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;
