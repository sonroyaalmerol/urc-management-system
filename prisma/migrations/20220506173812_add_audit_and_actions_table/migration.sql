-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "table_name" TEXT,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionTag" (
    "id" TEXT NOT NULL,
    "comment" TEXT,
    "color" TEXT,

    CONSTRAINT "ActionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "column_name" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActionToActionTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_acted_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActionToActionTag_AB_unique" ON "_ActionToActionTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ActionToActionTag_B_index" ON "_ActionToActionTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_acted_users_AB_unique" ON "_acted_users"("A", "B");

-- CreateIndex
CREATE INDEX "_acted_users_B_index" ON "_acted_users"("B");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToActionTag" ADD CONSTRAINT "_ActionToActionTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActionToActionTag" ADD CONSTRAINT "_ActionToActionTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ActionTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acted_users" ADD CONSTRAINT "_acted_users_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_acted_users" ADD CONSTRAINT "_acted_users_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
