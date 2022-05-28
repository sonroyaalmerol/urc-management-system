/*
  Warnings:

  - You are about to drop the column `logo_url` on the `Institute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Institute" DROP COLUMN "logo_url",
ADD COLUMN     "photo_id" TEXT;

-- AddForeignKey
ALTER TABLE "Institute" ADD CONSTRAINT "Institute_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
