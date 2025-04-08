/*
  Warnings:

  - Added the required column `filePath` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL;
