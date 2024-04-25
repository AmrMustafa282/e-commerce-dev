/*
  Warnings:

  - You are about to drop the column `upvote` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "upvote",
ADD COLUMN     "upvoteCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_reviewId_userId_key" ON "Upvote"("reviewId", "userId");
