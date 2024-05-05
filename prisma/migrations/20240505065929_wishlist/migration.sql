-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wishlist" TEXT[] DEFAULT ARRAY[]::TEXT[];
