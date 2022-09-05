/*
  Warnings:

  - You are about to drop the `_HotelToRoomType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_HotelToRoomType" DROP CONSTRAINT "_HotelToRoomType_A_fkey";

-- DropForeignKey
ALTER TABLE "_HotelToRoomType" DROP CONSTRAINT "_HotelToRoomType_B_fkey";

-- DropTable
DROP TABLE "_HotelToRoomType";
