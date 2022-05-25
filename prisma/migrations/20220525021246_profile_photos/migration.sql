/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "photo_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
