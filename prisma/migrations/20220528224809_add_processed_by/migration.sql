-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "processed_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
