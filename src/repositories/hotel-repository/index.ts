import { prisma } from '@/config';

function findAll() {
  return prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      rooms: {
        select: {
          roomNumber: true,
          roomType: { select: { name: true, capacity: true } },
          _count: { select: { ticket: true } },
        },
      },
    },
  });
}

function findAvailableRooms(hotelId: number) {
  return prisma.room.findMany({ where: { hotelId }, select: { _count: { select: { ticket: true } } } });
}

function findRoomInfo(roomId: number) {
  return prisma.room.findUnique({
    where: { id: roomId },
    include: { _count: { select: { ticket: true } }, roomType: { select: { capacity: true } } },
  });
}

const hotelsRepository = {
  findAll,
  findAvailableRooms,
  findRoomInfo,
};

export default hotelsRepository;
