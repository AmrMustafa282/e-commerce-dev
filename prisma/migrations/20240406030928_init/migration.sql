-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetExpires" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "passwordResetToken" TEXT NOT NULL DEFAULT '';
