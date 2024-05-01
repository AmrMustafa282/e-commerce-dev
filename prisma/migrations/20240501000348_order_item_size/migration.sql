/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Order` table. All the data in the column will be lost.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "size" TEXT NOT NULL;
