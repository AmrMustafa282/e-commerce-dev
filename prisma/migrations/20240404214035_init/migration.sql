/*
  Warnings:

  - You are about to drop the column `storeId` on the `Billboard` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Billboard_storeId_idx";

-- DropIndex
DROP INDEX "Category_storeId_idx";

-- DropIndex
DROP INDEX "Color_storeId_idx";

-- DropIndex
DROP INDEX "Order_storeId_idx";

-- DropIndex
DROP INDEX "Product_storeId_idx";

-- DropIndex
DROP INDEX "Size_storeId_idx";

-- AlterTable
ALTER TABLE "Billboard" DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "storeId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "storeId";

-- DropTable
DROP TABLE "Store";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
