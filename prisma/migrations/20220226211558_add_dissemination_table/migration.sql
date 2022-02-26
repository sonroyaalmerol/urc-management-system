/*
  Warnings:

  - You are about to drop the column `research_status` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `research_status` on the `URCFundedResearch` table. All the data in the column will be lost.
  - You are about to drop the `ExternalResearchInvolvement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ExternalResearch" DROP CONSTRAINT "ExternalResearch_research_status_fkey";

-- DropForeignKey
ALTER TABLE "ExternalResearchInvolvement" DROP CONSTRAINT "ExternalResearchInvolvement_external_research_id_fkey";

-- DropForeignKey
ALTER TABLE "ExternalResearchInvolvement" DROP CONSTRAINT "ExternalResearchInvolvement_proof_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "ExternalResearchInvolvement" DROP CONSTRAINT "ExternalResearchInvolvement_user_id_fkey";

-- DropForeignKey
ALTER TABLE "InstituteNews" DROP CONSTRAINT "InstituteNews_institute_id_fkey";

-- DropForeignKey
ALTER TABLE "URCFundedResearch" DROP CONSTRAINT "URCFundedResearch_research_status_fkey";

-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "research_status",
ADD COLUMN     "research_status_id" TEXT NOT NULL DEFAULT E'not_implemented';

-- AlterTable
ALTER TABLE "InstituteNews" ALTER COLUMN "institute_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "URCFundedResearch" DROP COLUMN "research_status",
ADD COLUMN     "research_status_id" TEXT NOT NULL DEFAULT E'not_implemented';

-- DropTable
DROP TABLE "ExternalResearchInvolvement";

-- CreateTable
CREATE TABLE "ResearchDissemination" (
    "id" TEXT NOT NULL,
    "is_external_research" BOOLEAN NOT NULL DEFAULT false,
    "urc_funded_research_id" TEXT,
    "external_research_id" TEXT,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "event_date" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "user_id" TEXT,

    CONSTRAINT "ResearchDissemination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchToResearchDissemination" (
    "id" TEXT NOT NULL,
    "urc_funded_research_id" TEXT,
    "external_research_id" TEXT,
    "research_dissemination_id" TEXT NOT NULL,

    CONSTRAINT "ResearchToResearchDissemination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchDisseminationToUnit" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "research_dissemination_id" TEXT NOT NULL,

    CONSTRAINT "ResearchDisseminationToUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchDissemination_title_key" ON "ResearchDissemination"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- AddForeignKey
ALTER TABLE "ExternalResearch" ADD CONSTRAINT "ExternalResearch_research_status_id_fkey" FOREIGN KEY ("research_status_id") REFERENCES "ResearchStatus"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "InstituteNews" ADD CONSTRAINT "InstituteNews_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchDissemination" ADD CONSTRAINT "ResearchDissemination_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchToResearchDissemination" ADD CONSTRAINT "ResearchToResearchDissemination_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchToResearchDissemination" ADD CONSTRAINT "ResearchToResearchDissemination_research_dissemination_id_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchToResearchDissemination" ADD CONSTRAINT "ResearchToResearchDissemination_urc_funded_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchDisseminationToUnit" ADD CONSTRAINT "ResearchDisseminationToUnit_research_dissemination_id_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchDisseminationToUnit" ADD CONSTRAINT "ResearchDisseminationToUnit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearch" ADD CONSTRAINT "URCFundedResearch_research_status_id_fkey" FOREIGN KEY ("research_status_id") REFERENCES "ResearchStatus"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
