/*
  Warnings:

  - You are about to drop the column `user_id` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `FileUpload` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `InstituteNews` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ResearchEventAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `UserToBookPublicationBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToExternalResearchBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToInstituteBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToJournalPublicationBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToProjectBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToResearchDisseminationBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToResearchPresentationBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UnitToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profile_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profile_id` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Download` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `ResearchEventAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_user_id_fkey";

-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_user_id_fkey";

-- DropForeignKey
ALTER TABLE "InstituteNews" DROP CONSTRAINT "InstituteNews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchEventAttendance" DROP CONSTRAINT "ResearchEventAttendance_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToBookPublicationBridge" DROP CONSTRAINT "UserToBookPublicationBridge_book_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToBookPublicationBridge" DROP CONSTRAINT "UserToBookPublicationBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToExternalResearchBridge" DROP CONSTRAINT "UserToExternalResearchBridge_external_research_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToExternalResearchBridge" DROP CONSTRAINT "UserToExternalResearchBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToInstituteBridge" DROP CONSTRAINT "UserToInstituteBridge_institute_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToInstituteBridge" DROP CONSTRAINT "UserToInstituteBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToJournalPublicationBridge" DROP CONSTRAINT "UserToJournalPublicationBridge_journal_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToJournalPublicationBridge" DROP CONSTRAINT "UserToJournalPublicationBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToProjectBridge" DROP CONSTRAINT "user_to_research_research_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToProjectBridge" DROP CONSTRAINT "UserToProjectBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToResearchDisseminationBridge" DROP CONSTRAINT "UserToResearchDisseminationBridge_research_dissemination_i_fkey";

-- DropForeignKey
ALTER TABLE "UserToResearchDisseminationBridge" DROP CONSTRAINT "UserToResearchDisseminationBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToResearchPresentationBridge" DROP CONSTRAINT "UserToResearchPresentationBridge_research_presentation_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToResearchPresentationBridge" DROP CONSTRAINT "UserToResearchPresentationBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_UnitToUser" DROP CONSTRAINT "_UnitToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_UnitToUser" DROP CONSTRAINT "_UnitToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserRole" DROP CONSTRAINT "_UserToUserRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserRole" DROP CONSTRAINT "_UserToUserRole_B_fkey";

-- DropForeignKey
ALTER TABLE "_acted_users" DROP CONSTRAINT "_acted_users_B_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FileUpload" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT;

-- AlterTable
ALTER TABLE "InstituteNews" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT;

-- AlterTable
ALTER TABLE "ResearchEventAttendance" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile_id" TEXT;

-- DropTable
DROP TABLE "UserToBookPublicationBridge";

-- DropTable
DROP TABLE "UserToExternalResearchBridge";

-- DropTable
DROP TABLE "UserToInstituteBridge";

-- DropTable
DROP TABLE "UserToJournalPublicationBridge";

-- DropTable
DROP TABLE "UserToProjectBridge";

-- DropTable
DROP TABLE "UserToResearchDisseminationBridge";

-- DropTable
DROP TABLE "UserToResearchPresentationBridge";

-- DropTable
DROP TABLE "_UnitToUser";

-- DropTable
DROP TABLE "_UserToUserRole";

-- CreateTable
CREATE TABLE "ProfileToInstituteBridge" (
    "profile_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "duration" TEXT,
    "start_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProfileToInstituteBridge_pkey" PRIMARY KEY ("profile_id","institute_id")
);

-- CreateTable
CREATE TABLE "ProfileToResearchPresentationBridge" (
    "profile_id" TEXT NOT NULL,
    "research_presentation_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProfileToResearchPresentationBridge_pkey" PRIMARY KEY ("profile_id","research_presentation_id")
);

-- CreateTable
CREATE TABLE "ProfileToResearchDisseminationBridge" (
    "profile_id" TEXT NOT NULL,
    "research_dissemination_id" TEXT NOT NULL,
    "role_title" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProfileToResearchDisseminationBridge_pkey" PRIMARY KEY ("profile_id","research_dissemination_id")
);

-- CreateTable
CREATE TABLE "ProfileToJournalPublicationBridge" (
    "profile_id" TEXT NOT NULL,
    "role_title" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "journal_publication_id" TEXT NOT NULL,

    CONSTRAINT "ProfileToJournalPublicationBridge_pkey" PRIMARY KEY ("profile_id","journal_publication_id")
);

-- CreateTable
CREATE TABLE "ProfileToBookPublicationBridge" (
    "profile_id" TEXT NOT NULL,
    "role_title" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "book_publication_id" TEXT NOT NULL,

    CONSTRAINT "ProfileToBookPublicationBridge_pkey" PRIMARY KEY ("profile_id","book_publication_id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileToExternalResearchBridge" (
    "external_research_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "profile_id" TEXT NOT NULL,

    CONSTRAINT "ProfileToExternalResearchBridge_pkey" PRIMARY KEY ("external_research_id","profile_id")
);

-- CreateTable
CREATE TABLE "ProfileToProjectBridge" (
    "project_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "admin_positions" TEXT,
    "profile_id" TEXT NOT NULL,

    CONSTRAINT "ProfileToProjectBridge_pkey" PRIMARY KEY ("project_id","profile_id")
);

-- CreateTable
CREATE TABLE "_ProfileToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProfileToUserRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToUnit_AB_unique" ON "_ProfileToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToUnit_B_index" ON "_ProfileToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToUserRole_AB_unique" ON "_ProfileToUserRole"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToUserRole_B_index" ON "_ProfileToUserRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_profile_id_key" ON "User"("profile_id");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteNews" ADD CONSTRAINT "InstituteNews_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToInstituteBridge" ADD CONSTRAINT "ProfileToInstituteBridge_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToInstituteBridge" ADD CONSTRAINT "ProfileToInstituteBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchEventAttendance" ADD CONSTRAINT "ResearchEventAttendance_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToResearchPresentationBridge" ADD CONSTRAINT "ProfileToResearchPresentationBridge_research_presentation__fkey" FOREIGN KEY ("research_presentation_id") REFERENCES "ResearchPresentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToResearchPresentationBridge" ADD CONSTRAINT "ProfileToResearchPresentationBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToResearchDisseminationBridge" ADD CONSTRAINT "ProfileToResearchDisseminationBridge_research_disseminatio_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToResearchDisseminationBridge" ADD CONSTRAINT "ProfileToResearchDisseminationBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToJournalPublicationBridge" ADD CONSTRAINT "ProfileToJournalPublicationBridge_journal_publication_id_fkey" FOREIGN KEY ("journal_publication_id") REFERENCES "JournalPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToJournalPublicationBridge" ADD CONSTRAINT "ProfileToJournalPublicationBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToBookPublicationBridge" ADD CONSTRAINT "ProfileToBookPublicationBridge_book_publication_id_fkey" FOREIGN KEY ("book_publication_id") REFERENCES "BookPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToBookPublicationBridge" ADD CONSTRAINT "ProfileToBookPublicationBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToExternalResearchBridge" ADD CONSTRAINT "ProfileToExternalResearchBridge_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToExternalResearchBridge" ADD CONSTRAINT "ProfileToExternalResearchBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToProjectBridge" ADD CONSTRAINT "user_to_research_research_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileToProjectBridge" ADD CONSTRAINT "ProfileToProjectBridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acted_users" ADD CONSTRAINT "_acted_users_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToUnit" ADD CONSTRAINT "_ProfileToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToUnit" ADD CONSTRAINT "_ProfileToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToUserRole" ADD CONSTRAINT "_ProfileToUserRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToUserRole" ADD CONSTRAINT "_ProfileToUserRole_B_fkey" FOREIGN KEY ("B") REFERENCES "UserRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
