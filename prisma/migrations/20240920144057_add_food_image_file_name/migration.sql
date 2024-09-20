/*
  Warnings:

  - You are about to drop the column `fileName` on the `Food` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "fileName",
ADD COLUMN     "img" TEXT;
