/*
  Warnings:

  - You are about to drop the column `calories` on the `Ingredient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "calories";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "calories" TEXT,
ADD COLUMN     "protein" TEXT;
