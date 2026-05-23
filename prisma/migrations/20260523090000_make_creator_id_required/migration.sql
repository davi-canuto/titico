-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_creatorId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "creatorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "creatorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
