-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "verified_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
