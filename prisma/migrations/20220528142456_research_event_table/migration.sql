/*
  Warnings:

  - You are about to drop the column `research_event_attendance_id` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the `ResearchEventAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FileUploadToResearchEventAttendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResearchEventAttendance" DROP CONSTRAINT "ResearchEventAttendance_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_research_event_attendance_id_fkey";

-- DropForeignKey
ALTER TABLE "_FileUploadToResearchEventAttendance" DROP CONSTRAINT "_FileUploadToResearchEventAttendance_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileUploadToResearchEventAttendance" DROP CONSTRAINT "_FileUploadToResearchEventAttendance_B_fkey";

-- AlterTable
ALTER TABLE "VerificationRequest" DROP COLUMN "research_event_attendance_id",
ADD COLUMN     "research_event_id" TEXT;

-- DropTable
DROP TABLE "ResearchEventAttendance";

-- DropTable
DROP TABLE "_FileUploadToResearchEventAttendance";

-- CreateTable
CREATE TABLE "ResearchEvent" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "event_name" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "description" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ResearchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileToResearchEventBridge" (
    "profile_id" TEXT NOT NULL,
    "research_event_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProfileToResearchEventBridge_pkey" PRIMARY KEY ("profile_id","research_event_id")
);

-- CreateTable
CREATE TABLE "_FileUploadToResearchEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchEvent_event_name_key" ON "ResearchEvent"("event_name");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToResearchEvent_AB_unique" ON "_FileUploadToResearchEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToResearchEvent_B_index" ON "_FileUploadToResearchEvent"("B");

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_research_event_id_fkey" FOREIGN KEY ("research_event_id") REFERENCES "ResearchEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToResearchEventBridge" ADD CONSTRAINT "ProfileToResearchEventBridge_research_event_id_fkey" FOREIGN KEY ("research_event_id") REFERENCES "ResearchEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToResearchEventBridge" ADD CONSTRAINT "ProfileToResearchEventBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchEvent" ADD CONSTRAINT "_FileUploadToResearchEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchEvent" ADD CONSTRAINT "_FileUploadToResearchEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
