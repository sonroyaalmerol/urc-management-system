-- CreateTable
CREATE TABLE "DownloadCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DownloadCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DownloadToDownloadCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DownloadToDownloadCategory_AB_unique" ON "_DownloadToDownloadCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_DownloadToDownloadCategory_B_index" ON "_DownloadToDownloadCategory"("B");

-- AddForeignKey
ALTER TABLE "_DownloadToDownloadCategory" ADD CONSTRAINT "_DownloadToDownloadCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Download"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DownloadToDownloadCategory" ADD CONSTRAINT "_DownloadToDownloadCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "DownloadCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
