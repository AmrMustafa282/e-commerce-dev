/*
  Warnings:

  - You are about to drop the `_ProductToSize` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "_ProductToSize";

-- CreateTable
CREATE TABLE "ProductSize" (
    "id" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductSize_sizeId_idx" ON "ProductSize"("sizeId");

-- CreateIndex
CREATE INDEX "ProductSize_productId_idx" ON "ProductSize"("productId");
