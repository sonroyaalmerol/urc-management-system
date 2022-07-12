/*
  Warnings:

  - The `event_date` column on the `ResearchDissemination` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `event_date` column on the `ResearchPresentation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "event_date",
ADD COLUMN     "event_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "event_date",
ADD COLUMN     "event_date" TIMESTAMP(3);
