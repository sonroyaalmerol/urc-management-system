-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapsuleProposalRequirement" (
    "id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "research_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "CapsuleProposalRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapsuleProposalSubmission" (
    "id" TEXT NOT NULL,
    "requirement_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "research_thrust" TEXT NOT NULL,
    "brief_background" TEXT NOT NULL,
    "objectives_of_the_study" TEXT NOT NULL,
    "significance_of_the_study" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,

    CONSTRAINT "CapsuleProposalSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "deliverable_submission_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliverableSubmission" (
    "id" TEXT NOT NULL,
    "deliverable_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DeliverableSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "research_id" TEXT NOT NULL,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "upload_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalResearch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT,
    "main_proponents" TEXT,
    "co_proponents" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "cycle" TEXT,
    "budget" DOUBLE PRECISION,
    "upload_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "research_status_id" TEXT NOT NULL DEFAULT E'not_implemented',
    "slug" TEXT,

    CONSTRAINT "ExternalResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" TEXT NOT NULL,
    "google_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resource_key" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id","google_id")
);

-- CreateTable
CREATE TABLE "FullBlownProposalRequirement" (
    "id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "research_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "FullBlownProposalRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FullBlownProposalSubmission" (
    "id" TEXT NOT NULL,
    "requirement_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "upload_id" TEXT NOT NULL,

    CONSTRAINT "FullBlownProposalSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteNews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "institute_id" TEXT,
    "user_id" TEXT,
    "upload_id" TEXT,

    CONSTRAINT "InstituteNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT,
    "description" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteToUserBridge" (
    "user_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "InstituteToUserBridge_pkey" PRIMARY KEY ("user_id","institute_id")
);

-- CreateTable
CREATE TABLE "ResearchEventAttendance" (
    "id" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "event_name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "proof_upload_id" TEXT NOT NULL,

    CONSTRAINT "ResearchEventAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchPresentation" (
    "id" TEXT NOT NULL,
    "is_external_research" BOOLEAN NOT NULL DEFAULT false,
    "urc_funded_research_id" TEXT,
    "external_research_id" TEXT,
    "event_title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "event_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "presentor" TEXT,
    "conference" TEXT,
    "budget" DOUBLE PRECISION,
    "url" TEXT,
    "user_id" TEXT,

    CONSTRAINT "ResearchPresentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchDissemination" (
    "id" TEXT NOT NULL,
    "is_external_research" BOOLEAN NOT NULL DEFAULT false,
    "urc_funded_research_id" TEXT,
    "external_research_id" TEXT,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "organization" TEXT,
    "event_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "user_id" TEXT,

    CONSTRAINT "ResearchDissemination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalResearchToDisseminationBridge" (
    "external_research_id" TEXT NOT NULL,
    "research_dissemination_id" TEXT NOT NULL,

    CONSTRAINT "ExternalResearchToDisseminationBridge_pkey" PRIMARY KEY ("research_dissemination_id","external_research_id")
);

-- CreateTable
CREATE TABLE "URCFundedResearchToDisseminationBridge" (
    "urc_funded_research_id" TEXT NOT NULL,
    "research_dissemination_id" TEXT NOT NULL,

    CONSTRAINT "URCFundedResearchToDisseminationBridge_pkey" PRIMARY KEY ("research_dissemination_id","urc_funded_research_id")
);

-- CreateTable
CREATE TABLE "JournalPublication" (
    "id" TEXT NOT NULL,
    "is_external_research" BOOLEAN NOT NULL DEFAULT false,
    "urc_funded_research_id" TEXT,
    "external_research_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "proof_upload_id" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date_published" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "issn" TEXT,
    "journal" TEXT,
    "url" TEXT,
    "slug" TEXT,
    "is_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "JournalPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookPublication" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "proof_upload_id" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "publisher" TEXT,
    "isbn" TEXT,
    "slug" TEXT,
    "date_published" TIMESTAMP(3),

    CONSTRAINT "BookPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalPublicationToUnitBridge" (
    "unit_id" TEXT NOT NULL,
    "journal_publication_id" TEXT NOT NULL,

    CONSTRAINT "JournalPublicationToUnitBridge_pkey" PRIMARY KEY ("unit_id","journal_publication_id")
);

-- CreateTable
CREATE TABLE "BookPublicationToUnitBridge" (
    "unit_id" TEXT NOT NULL,
    "book_publication_id" TEXT NOT NULL,

    CONSTRAINT "BookPublicationToUnitBridge_pkey" PRIMARY KEY ("unit_id","book_publication_id")
);

-- CreateTable
CREATE TABLE "ResearchStatus" (
    "id" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "ResearchStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionRequirement" (
    "id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "research_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "revision_requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionSubmission" (
    "id" TEXT NOT NULL,
    "requirement_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "revision_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "parent_unit_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchPresentationToUnitBridge" (
    "unit_id" TEXT NOT NULL,
    "research_presentation_id" TEXT NOT NULL,

    CONSTRAINT "ResearchPresentationToUnitBridge_pkey" PRIMARY KEY ("unit_id","research_presentation_id")
);

-- CreateTable
CREATE TABLE "ResearchDisseminationToUnitBridge" (
    "unit_id" TEXT NOT NULL,
    "research_dissemination_id" TEXT NOT NULL,

    CONSTRAINT "ResearchDisseminationToUnitBridge_pkey" PRIMARY KEY ("unit_id","research_dissemination_id")
);

-- CreateTable
CREATE TABLE "URCFundedResearchToUnitBridge" (
    "unit_id" TEXT NOT NULL,
    "urc_funded_research_id" TEXT NOT NULL,

    CONSTRAINT "URCFundedResearchToUnitBridge_pkey" PRIMARY KEY ("unit_id","urc_funded_research_id")
);

-- CreateTable
CREATE TABLE "URCFundedResearch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "main_proponents" TEXT,
    "co_proponents" TEXT,
    "duration" TEXT,
    "cycle" TEXT,
    "budget" DOUBLE PRECISION,
    "source_of_fund" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "research_status_id" TEXT NOT NULL DEFAULT E'not_implemented',
    "slug" TEXT,

    CONSTRAINT "URCFundedResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL DEFAULT E'default',
    "comment" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unit_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToExternalResearchBridge" (
    "external_research_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserToExternalResearchBridge_pkey" PRIMARY KEY ("external_research_id","user_id")
);

-- CreateTable
CREATE TABLE "UserToRoleBridge" (
    "role_id" TEXT NOT NULL DEFAULT E'default',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserToRoleBridge_pkey" PRIMARY KEY ("role_id","user_id")
);

-- CreateTable
CREATE TABLE "UserToURCFundedResearchBridge" (
    "urc_funded_research_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "admin_positions" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserToURCFundedResearchBridge_pkey" PRIMARY KEY ("urc_funded_research_id","user_id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "CapsuleProposalSubmission_requirement_id_key" ON "CapsuleProposalSubmission"("requirement_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalResearch_title_key" ON "ExternalResearch"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FileUpload_id_key" ON "FileUpload"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FileUpload_google_id_key" ON "FileUpload"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "FullBlownProposalSubmission_requirement_id_key" ON "FullBlownProposalSubmission"("requirement_id");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteNews_title_key" ON "InstituteNews"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPresentation_event_title_key" ON "ResearchPresentation"("event_title");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchDissemination_title_key" ON "ResearchDissemination"("title");

-- CreateIndex
CREATE UNIQUE INDEX "JournalPublication_title_key" ON "JournalPublication"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BookPublication_title_key" ON "BookPublication"("title");

-- CreateIndex
CREATE UNIQUE INDEX "revision_submission_requirement_id_key" ON "RevisionSubmission"("requirement_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "URCFundedResearch_title_key" ON "URCFundedResearch"("title");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapsuleProposalRequirement" ADD CONSTRAINT "CapsuleProposalRequirement_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "CapsuleProposalSubmission" ADD CONSTRAINT "CapsuleProposalSubmission_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "CapsuleProposalRequirement"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_deliverable_submission_id_fkey" FOREIGN KEY ("deliverable_submission_id") REFERENCES "DeliverableSubmission"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "DeliverableSubmission" ADD CONSTRAINT "DeliverableSubmission_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "Deliverable"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ExternalResearch" ADD CONSTRAINT "ExternalResearch_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ExternalResearch" ADD CONSTRAINT "ExternalResearch_research_status_id_fkey" FOREIGN KEY ("research_status_id") REFERENCES "ResearchStatus"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "FullBlownProposalRequirement" ADD CONSTRAINT "FullBlownProposalRequirement_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "FullBlownProposalSubmission" ADD CONSTRAINT "FullBlownProposalSubmission_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "FullBlownProposalSubmission" ADD CONSTRAINT "FullBlownProposalSubmission_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "FullBlownProposalRequirement"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "InstituteNews" ADD CONSTRAINT "InstituteNews_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "InstituteNews" ADD CONSTRAINT "InstituteNews_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "InstituteNews" ADD CONSTRAINT "InstituteNews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "InstituteToUserBridge" ADD CONSTRAINT "InstituteToUserBridge_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "InstituteToUserBridge" ADD CONSTRAINT "InstituteToUserBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchEventAttendance" ADD CONSTRAINT "ResearchEventAttendance_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchEventAttendance" ADD CONSTRAINT "ResearchEventAttendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentation" ADD CONSTRAINT "ResearchPresentation_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentation" ADD CONSTRAINT "ResearchPresentation_urc_funded_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentation" ADD CONSTRAINT "ResearchPresentation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchDissemination" ADD CONSTRAINT "ResearchDissemination_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ExternalResearchToDisseminationBridge" ADD CONSTRAINT "ExternalResearchToDisseminationBridge_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ExternalResearchToDisseminationBridge" ADD CONSTRAINT "ExternalResearchToDisseminationBridge_research_disseminati_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearchToDisseminationBridge" ADD CONSTRAINT "URCFundedResearchToDisseminationBridge_research_disseminat_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearchToDisseminationBridge" ADD CONSTRAINT "URCFundedResearchToDisseminationBridge_urc_funded_research_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_urc_funded_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_proof_upload_id_fkey" FOREIGN KEY ("proof_upload_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublicationToUnitBridge" ADD CONSTRAINT "JournalPublicationToUnitBridge_journal_publication_id_fkey" FOREIGN KEY ("journal_publication_id") REFERENCES "JournalPublication"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JournalPublicationToUnitBridge" ADD CONSTRAINT "JournalPublicationToUnitBridge_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublicationToUnitBridge" ADD CONSTRAINT "BookPublicationToUnitBridge_book_publication_id_fkey" FOREIGN KEY ("book_publication_id") REFERENCES "BookPublication"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "BookPublicationToUnitBridge" ADD CONSTRAINT "BookPublicationToUnitBridge_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RevisionRequirement" ADD CONSTRAINT "revision_requirement_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RevisionSubmission" ADD CONSTRAINT "revision_submission_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "RevisionRequirement"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_parent_unit_id_fkey" FOREIGN KEY ("parent_unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentationToUnitBridge" ADD CONSTRAINT "ResearchPresentationToUnitBridge_research_presentation_id_fkey" FOREIGN KEY ("research_presentation_id") REFERENCES "ResearchPresentation"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchPresentationToUnitBridge" ADD CONSTRAINT "ResearchPresentationToUnitBridge_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchDisseminationToUnitBridge" ADD CONSTRAINT "ResearchDisseminationToUnitBridge_research_dissemination_i_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ResearchDisseminationToUnitBridge" ADD CONSTRAINT "ResearchDisseminationToUnitBridge_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearchToUnitBridge" ADD CONSTRAINT "URCFundedResearchToUnitBridge_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearchToUnitBridge" ADD CONSTRAINT "URCFundedResearchToUnitBridge_urc_funded_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "URCFundedResearch" ADD CONSTRAINT "URCFundedResearch_research_status_id_fkey" FOREIGN KEY ("research_status_id") REFERENCES "ResearchStatus"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToExternalResearchBridge" ADD CONSTRAINT "UserToExternalResearchBridge_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToExternalResearchBridge" ADD CONSTRAINT "UserToExternalResearchBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToRoleBridge" ADD CONSTRAINT "UserToRoleBridge_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToRoleBridge" ADD CONSTRAINT "UserToRoleBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToURCFundedResearchBridge" ADD CONSTRAINT "user_to_research_research_id_fkey" FOREIGN KEY ("urc_funded_research_id") REFERENCES "URCFundedResearch"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserToURCFundedResearchBridge" ADD CONSTRAINT "UserToURCFundedResearchBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
