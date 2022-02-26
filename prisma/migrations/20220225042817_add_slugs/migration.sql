-- AlterTable
ALTER TABLE "BookPublication" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "ExternalResearch" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "JournalPublication" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "ResearchPresentation" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "URCFundedResearch" ADD COLUMN     "slug" TEXT;
