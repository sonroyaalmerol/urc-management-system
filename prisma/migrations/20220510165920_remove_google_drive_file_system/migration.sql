/*
  Warnings:

  - You are about to drop the column `google_id` on the `FileUpload` table. All the data in the column will be lost.
  - You are about to drop the column `resource_key` on the `FileUpload` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FileUpload_google_id_key";

-- AlterTable
ALTER TABLE "FileUpload" DROP COLUMN "google_id",
DROP COLUMN "resource_key";
