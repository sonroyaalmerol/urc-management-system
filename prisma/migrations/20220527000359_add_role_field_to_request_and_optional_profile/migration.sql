-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "role" TEXT,
ALTER COLUMN "profile_id" DROP NOT NULL;
