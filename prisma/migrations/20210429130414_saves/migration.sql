-- CreateTable
CREATE TABLE "_UserSavesPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSavesPost_AB_unique" ON "_UserSavesPost"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSavesPost_B_index" ON "_UserSavesPost"("B");

-- AddForeignKey
ALTER TABLE "_UserSavesPost" ADD FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSavesPost" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
