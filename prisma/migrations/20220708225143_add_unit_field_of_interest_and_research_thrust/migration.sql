/*
  Warnings:

  - You are about to drop the column `research_thrust` on the `CapsuleProposalSubmission` table. All the data in the column will be lost.
  - Added the required column `tentative_budget` to the `CapsuleProposalSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tentative_schedule` to the `CapsuleProposalSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CapsuleProposalSubmission" DROP COLUMN "research_thrust",
ADD COLUMN     "research_thrust_id" TEXT,
ADD COLUMN     "tentative_budget" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tentative_schedule" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UniversityMission" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "description" TEXT NOT NULL,

    CONSTRAINT "UniversityMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchThrust" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "university_mission_id" TEXT,

    CONSTRAINT "ResearchThrust_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchArea" (
    "field" TEXT NOT NULL,

    CONSTRAINT "ResearchArea_pkey" PRIMARY KEY ("field")
);

-- CreateTable
CREATE TABLE "_ProjectToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProfileToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToResearchArea_AB_unique" ON "_ProjectToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToResearchArea_B_index" ON "_ProjectToResearchArea"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToResearchArea_AB_unique" ON "_ProfileToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToResearchArea_B_index" ON "_ProfileToResearchArea"("B");

-- AddForeignKey
ALTER TABLE "CapsuleProposalSubmission" ADD CONSTRAINT "CapsuleProposalSubmission_research_thrust_id_fkey" FOREIGN KEY ("research_thrust_id") REFERENCES "ResearchThrust"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchThrust" ADD CONSTRAINT "ResearchThrust_university_mission_id_fkey" FOREIGN KEY ("university_mission_id") REFERENCES "UniversityMission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToResearchArea" ADD CONSTRAINT "_ProjectToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToResearchArea" ADD CONSTRAINT "_ProjectToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("field") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToResearchArea" ADD CONSTRAINT "_ProfileToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToResearchArea" ADD CONSTRAINT "_ProfileToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("field") ON DELETE CASCADE ON UPDATE CASCADE;
