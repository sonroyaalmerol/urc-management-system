/*
  Warnings:

  - A unique constraint covering the columns `[event_name]` on the table `ResearchEventAttendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResearchEventAttendance_event_name_key" ON "ResearchEventAttendance"("event_name");
