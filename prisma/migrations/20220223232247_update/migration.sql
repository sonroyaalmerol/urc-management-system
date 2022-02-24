-- AlterTable
ALTER TABLE "CapsuleProposalRequirement" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CapsuleProposalSubmission" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Deliverable" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "DeliverableSubmission" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Download" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ExternalResearch" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ExternalResearchInvolvement" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FileUpload" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FullBlownProposalRequirement" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FullBlownProposalSubmission" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Institute" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InstituteNews" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InstituteToUserBridge" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ResearchEventAttendance" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ResearchPresentation" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ResearchPublication" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RevisionRequirement" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RevisionSubmission" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "URCFundedResearch" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Unit" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserToExternalResearchBridge" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserToURCFundedResearchBridge" ALTER COLUMN "updated_at" DROP DEFAULT;
