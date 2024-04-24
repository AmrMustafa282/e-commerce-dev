/*
  Warnings:

  - You are about to drop the column `sizeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Size` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_sizeId_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sizeId";

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "_ProductToSize" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSize_AB_unique" ON "_ProductToSize"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSize_B_index" ON "_ProductToSize"("B");
