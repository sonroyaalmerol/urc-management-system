-- DropForeignKey
ALTER TABLE "BookPublication" DROP CONSTRAINT "BookPublication_user_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchDissemination" DROP CONSTRAINT "ResearchDissemination_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentation" DROP CONSTRAINT "ResearchPresentation_user_id_fkey";

-- CreateTable
CREATE TABLE "UserToResearchPresentationBridge" (
    "user_id" TEXT NOT NULL,
    "research_presentation_id" TEXT NOT NULL,

    CONSTRAINT "UserToResearchPresentationBridge_pkey" PRIMARY KEY ("user_id","research_presentation_id")
);

-- CreateTable
CREATE TABLE "UserToResearchDisseminationBridge" (
    "user_id" TEXT NOT NULL,
    "research_dissemination_id" TEXT NOT NULL,

    CONSTRAINT "UserToResearchDisseminationBridge_pkey" PRIMARY KEY ("user_id","research_dissemination_id")
);

-- CreateTable
CREATE TABLE "UserToJournalPublicationBridge" (
    "user_id" TEXT NOT NULL,
    "journal_publication_id" TEXT NOT NULL,

    CONSTRAINT "UserToJournalPublicationBridge_pkey" PRIMARY KEY ("user_id","journal_publication_id")
);

-- CreateTable
CREATE TABLE "UserToBookPublicationBridge" (
    "user_id" TEXT NOT NULL,
    "book_publication_id" TEXT NOT NULL,

    CONSTRAINT "UserToBookPublicationBridge_pkey" PRIMARY KEY ("user_id","book_publication_id")
);

-- AddForeignKey
ALTER TABLE "UserToResearchPresentationBridge" ADD CONSTRAINT "UserToResearchPresentationBridge_research_presentation_id_fkey" FOREIGN KEY ("research_presentation_id") REFERENCES "ResearchPresentation"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToResearchPresentationBridge" ADD CONSTRAINT "UserToResearchPresentationBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToResearchDisseminationBridge" ADD CONSTRAINT "UserToResearchDisseminationBridge_research_dissemination_i_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToResearchDisseminationBridge" ADD CONSTRAINT "UserToResearchDisseminationBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToJournalPublicationBridge" ADD CONSTRAINT "UserToJournalPublicationBridge_journal_publication_id_fkey" FOREIGN KEY ("journal_publication_id") REFERENCES "JournalPublication"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToJournalPublicationBridge" ADD CONSTRAINT "UserToJournalPublicationBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToBookPublicationBridge" ADD CONSTRAINT "UserToBookPublicationBridge_book_publication_id_fkey" FOREIGN KEY ("book_publication_id") REFERENCES "BookPublication"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToBookPublicationBridge" ADD CONSTRAINT "UserToBookPublicationBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
