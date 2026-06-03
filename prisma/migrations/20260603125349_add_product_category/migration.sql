-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('carroserie', 'moteur', 'freins', 'suspension');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'carroserie';
