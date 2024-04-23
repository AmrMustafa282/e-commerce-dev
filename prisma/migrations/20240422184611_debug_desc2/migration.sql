/*
  Warnings:

  - You are about to drop the column `relatedProductsId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `RelatedProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Product_relatedProductsId_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "relatedProductsId";

-- DropTable
DROP TABLE "RelatedProducts";
