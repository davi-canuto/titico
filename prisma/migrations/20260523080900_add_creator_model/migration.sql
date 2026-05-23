-- DropIndex
DROP INDEX "Purchase_userId_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "accessLevel",
ADD COLUMN     "creatorId" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "accessLevel",
ADD COLUMN     "creatorId" TEXT;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "accessLevel";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessLevel";

-- DropEnum
DROP TYPE "AccessLevel";

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "champion" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "bannerUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentProduct" (
    "contentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ContentProduct_pkey" PRIMARY KEY ("contentId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creator_slug_key" ON "Creator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_userId_productId_key" ON "Purchase"("userId", "productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentProduct" ADD CONSTRAINT "ContentProduct_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentProduct" ADD CONSTRAINT "ContentProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
