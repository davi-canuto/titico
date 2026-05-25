-- DropIndex
DROP INDEX "Purchase_userId_productId_key";

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "guestEmail" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
