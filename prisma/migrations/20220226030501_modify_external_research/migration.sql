/*
  Warnings:

  - You are about to drop the column `page_number` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `publisher_page_url` on the `ExternalResearch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "page_number",
DROP COLUMN "publisher_page_url",
ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "co_proponents" TEXT,
ADD COLUMN     "cycle" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "main_proponents" TEXT;
