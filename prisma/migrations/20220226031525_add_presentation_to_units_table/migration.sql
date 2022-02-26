-- DropForeignKey
ALTER TABLE "BookPublication" DROP CONSTRAINT "BookPublication_proof_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "BookPublication" DROP CONSTRAINT "BookPublication_user_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_proof_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentation" DROP CONSTRAINT "ResearchPresentation_user_id_fkey";

-- AlterTable
ALTER TABLE "BookPublication" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "proof_upload_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JournalPublication" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "proof_upload_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ResearchPresentation" ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ResearchPresentationToUnit" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "research_presentation_id" TEXT NOT NULL,

    CONSTRAINT "ResearchPresentationToUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResearchPresentation" ADD CONSTRAINT "ResearchPresentation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentationToUnit" ADD CONSTRAINT "ResearchPresentationToUnit_research_presentation_id_fkey" FOREIGN KEY ("research_presentation_id") REFERENCES "ResearchPresentation"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentationToUnit" ADD CONSTRAINT "ResearchPresentationToUnit_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
