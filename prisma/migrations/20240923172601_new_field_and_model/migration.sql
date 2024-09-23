-- CreateTable
CREATE TABLE "SaleTempDetail" (
    "id" SERIAL NOT NULL,
    "saleTempId" INTEGER NOT NULL,
    "addedMoney" INTEGER,
    "tasteId" INTEGER,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "SaleTempDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
