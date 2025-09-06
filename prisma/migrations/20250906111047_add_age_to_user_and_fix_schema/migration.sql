/*
  Warnings:

  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ContentNode" ADD COLUMN     "googleDriveFileId" TEXT,
ALTER COLUMN "contentJson" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "age" INTEGER NOT NULL;
