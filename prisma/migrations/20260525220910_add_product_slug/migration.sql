-- AlterTable
ALTER TABLE "Product" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

-- Backfill: use id as temporary slug for existing products
UPDATE "Product" SET slug = id WHERE slug = '';

-- AddUniqueConstraint
ALTER TABLE "Product" ADD CONSTRAINT "Product_slug_key" UNIQUE ("slug");

-- RemoveDefault
ALTER TABLE "Product" ALTER COLUMN "slug" DROP DEFAULT;
