/*
  Warnings:

  - You are about to drop the column `UserId` on the `SaleTemp` table. All the data in the column will be lost.
  - Added the required column `userId` to the `SaleTemp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleTemp" DROP COLUMN "UserId",
ADD COLUMN     "userId" INTEGER NOT NULL;
