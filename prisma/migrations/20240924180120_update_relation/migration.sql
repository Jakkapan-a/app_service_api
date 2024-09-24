/*
  Warnings:

  - You are about to drop the column `addMoney` on the `SaleTemp` table. All the data in the column will be lost.
  - You are about to drop the column `tasteId` on the `SaleTemp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SaleTemp" DROP COLUMN "addMoney",
DROP COLUMN "tasteId";
