/*
  Warnings:

  - Added the required column `relatedProductsId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "relatedProductsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RelatedProducts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'name',

    CONSTRAINT "RelatedProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_relatedProductsId_idx" ON "Product"("relatedProductsId");
