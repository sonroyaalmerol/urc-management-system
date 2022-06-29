-- CreateTable
CREATE TABLE "_FileUploadToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToProject_AB_unique" ON "_FileUploadToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToProject_B_index" ON "_FileUploadToProject"("B");

-- AddForeignKey
ALTER TABLE "_FileUploadToProject" ADD CONSTRAINT "_FileUploadToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToProject" ADD CONSTRAINT "_FileUploadToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
