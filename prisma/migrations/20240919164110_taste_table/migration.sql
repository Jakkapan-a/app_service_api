-- CreateTable
CREATE TABLE "Taste" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "status" TEXT NOT NULL DEFAULT 'use',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "FoodTypeId" INTEGER NOT NULL,

    CONSTRAINT "Taste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Taste" ADD CONSTRAINT "Taste_FoodTypeId_fkey" FOREIGN KEY ("FoodTypeId") REFERENCES "FoodType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
