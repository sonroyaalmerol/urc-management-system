/*
  Warnings:

  - You are about to drop the column `end_date` on the `ResearchEvent` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `ResearchEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResearchEvent" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "duration_end" TIMESTAMP(3),
ADD COLUMN     "duration_start" TIMESTAMP(3);
