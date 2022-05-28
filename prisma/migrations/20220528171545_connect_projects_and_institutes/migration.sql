-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "institute_id" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
