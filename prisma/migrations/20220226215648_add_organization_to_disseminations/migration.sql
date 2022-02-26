-- AlterTable
ALTER TABLE "ResearchDissemination" ADD COLUMN     "organization" TEXT,
ALTER COLUMN "location" DROP NOT NULL;
