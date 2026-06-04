-- Remplace l'ancienne valeur d'enum "freins" par "transmission"
-- et ajoute la nouvelle categorie "eclairage".

ALTER TYPE "ProductCategory" RENAME TO "ProductCategory_old";

CREATE TYPE "ProductCategory" AS ENUM (
  'carroserie',
  'moteur',
  'transmission',
  'eclairage',
  'suspension'
);

ALTER TABLE "Product"
ALTER COLUMN "category" DROP DEFAULT;

ALTER TABLE "Product"
ALTER COLUMN "category" TYPE "ProductCategory"
USING (
  CASE
    WHEN "category"::text = 'freins' THEN 'transmission'
    ELSE "category"::text
  END
)::"ProductCategory";

ALTER TABLE "Product"
ALTER COLUMN "category" SET DEFAULT 'carroserie';

DROP TYPE "ProductCategory_old";
