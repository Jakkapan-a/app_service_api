/*
  Warnings:

  - You are about to drop the column `foodTypeId` on the `FoodSize` table. All the data in the column will be lost.
  - Added the required column `FoodTypeId` to the `FoodSize` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodSize" DROP CONSTRAINT "FoodSize_foodTypeId_fkey";

-- AlterTable
ALTER TABLE "FoodSize" DROP COLUMN "foodTypeId",
ADD COLUMN     "FoodTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "money" INTEGER NOT NULL,
    "foodType" TEXT NOT NULL DEFAULT 'food',
    "status" TEXT NOT NULL DEFAULT 'use',
    "FoodTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodSize" ADD CONSTRAINT "FoodSize_FoodTypeId_fkey" FOREIGN KEY ("FoodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_FoodTypeId_fkey" FOREIGN KEY ("FoodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
