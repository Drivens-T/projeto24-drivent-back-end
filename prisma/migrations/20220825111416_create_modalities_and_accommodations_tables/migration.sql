/*
  Warnings:

  - You are about to drop the column `accommodation` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `modality` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `modalityId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "accommodation",
DROP COLUMN "modality",
ADD COLUMN     "accommodationId" INTEGER,
ADD COLUMN     "modalityId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "modality";

-- CreateTable
CREATE TABLE "modalities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modalities_name_eventId_key" ON "modalities"("name", "eventId");

-- AddForeignKey
ALTER TABLE "modalities" ADD CONSTRAINT "modalities_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "modalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
