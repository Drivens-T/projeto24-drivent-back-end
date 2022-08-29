-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_accommodationId_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "paid" SET DEFAULT false,
ALTER COLUMN "accommodationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
