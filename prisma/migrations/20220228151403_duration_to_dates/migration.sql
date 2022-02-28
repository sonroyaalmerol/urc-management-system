/*
  Warnings:

  - You are about to drop the column `duration` on the `URCFundedResearch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "URCFundedResearch" DROP COLUMN "duration",
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);
