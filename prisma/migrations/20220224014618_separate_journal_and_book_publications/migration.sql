/*
  Warnings:

  - You are about to drop the column `journal_or_book` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the `ResearchPublication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResearchPublication" DROP CONSTRAINT "ResearchPublication_external_research_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPublication" DROP CONSTRAINT "ResearchPublication_proof_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPublication" DROP CONSTRAINT "ResearchPublication_urc_funded_research_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPublication" DROP CONSTRAINT "ResearchPublication_user_id_fkey";

-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "journal_or_book";

-- AlterTable
ALTER TABLE "URCFundedResearch" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "co_proponents" TEXT,
ADD COLUMN     "cycle" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "main_proponents" TEXT,
ADD COLUMN     "source_of_fund" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3);

-- DropTable
DROP TABLE "ResearchPublication";

-- CreateTable
CREATE TABLE "JournalPublication" (
    "id" TEXT NOT NULL,
    "is_external_research" BOOLEAN NOT NULL DEFAULT false,
    "urc_funded_research_id" TEXT,
    "external_research_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "proof_upload_id" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date_published" TIMESTAMP(3),
    "issn" TEXT,
    "journal" TEXT,
    "url" TEXT,
    "is_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "JournalPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookPublication" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "proof_upload_id" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "publisher" TEXT,
    "isbn" TEXT,
    "date_published" TIMESTAMP(3),

    CONSTRAINT "BookPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalPublicationToUnit" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "journal_publication_id" TEXT NOT NULL,

    CONSTRAINT "JournalPublicationToUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookPublicationToUnit" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "book_publication_id" TEXT NOT NULL,

    CONSTRAINT "BookPublicationToUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "URCFundedResearchToUnit" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "urc_funded_research_id" TEXT NOT NULL,

    CONSTRAINT "URCFundedResearchToUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_urc_funded_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublicationToUnit" ADD CONSTRAINT "JournalPublicationToUnit_journal_publication_id_fkey" FOREIGN KEY ("journal_publication_id") REFERENCES "JournalPublication"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublicationToUnit" ADD CONSTRAINT "JournalPublicationToUnit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublicationToUnit" ADD CONSTRAINT "BookPublicationToUnit_book_publication_id_fkey" FOREIGN KEY ("book_publication_id") REFERENCES "BookPublication"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublicationToUnit" ADD CONSTRAINT "BookPublicationToUnit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearchToUnit" ADD CONSTRAINT "URCFundedResearchToUnit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearchToUnit" ADD CONSTRAINT "URCFundedResearchToUnit_urc_funded_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
