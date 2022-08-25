/*
  Warnings:

  - Made the column `accommodationId` on table `tickets` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_accommodationId_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "accommodationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
