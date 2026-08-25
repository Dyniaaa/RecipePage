/*
  Warnings:

  - The `calories` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `protein` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "servings" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "calories",
ADD COLUMN     "calories" DOUBLE PRECISION,
DROP COLUMN "protein",
ADD COLUMN     "protein" DOUBLE PRECISION;
