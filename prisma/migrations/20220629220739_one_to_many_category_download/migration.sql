/*
  Warnings:

  - You are about to drop the `_DownloadToDownloadCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `Download` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Download` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DownloadToDownloadCategory" DROP CONSTRAINT "_DownloadToDownloadCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_DownloadToDownloadCategory" DROP CONSTRAINT "_DownloadToDownloadCategory_B_fkey";

-- AlterTable
ALTER TABLE "Download" ADD COLUMN     "category_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DownloadToDownloadCategory";

-- CreateIndex
CREATE UNIQUE INDEX "Download_category_id_key" ON "Download"("category_id");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "DownloadCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
