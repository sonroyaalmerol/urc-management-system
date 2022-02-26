/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `BookPublication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `ExternalResearch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `JournalPublication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_title]` on the table `ResearchPresentation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `URCFundedResearch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookPublication_title_key" ON "BookPublication"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalResearch_title_key" ON "ExternalResearch"("title");

-- CreateIndex
CREATE UNIQUE INDEX "JournalPublication_title_key" ON "JournalPublication"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPresentation_event_title_key" ON "ResearchPresentation"("event_title");

-- CreateIndex
CREATE UNIQUE INDEX "URCFundedResearch_title_key" ON "URCFundedResearch"("title");
