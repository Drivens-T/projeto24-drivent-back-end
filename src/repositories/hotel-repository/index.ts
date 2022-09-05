import { prisma } from '@/config';

function findAll() {
  return prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      rooms: {
        select: {
          id: true,
          roomNumber: true,
          roomType: { select: { name: true, capacity: true } },
          _count: { select: { ticket: true } },
        },
        orderBy: { roomNumber: 'asc' },
      },
    },
  });
}

function findById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      rooms: {
        select: {
          id: true,
          roomNumber: true,
          roomType: { select: { name: true, capacity: true } },
          _count: { select: { ticket: true } },
        },
        orderBy: { roomNumber: 'asc' },
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

function findBookedRoomByUserId(userId: number) {
  return prisma.room.findFirst({
    where: { ticket: { some: { userId: { equals: userId } } } },
    select: {
      id: true,
      roomNumber: true,
      roomType: {
        select: { name: true, id: true, capacity: true },
      },
      hotel: { select: { id: true, name: true, imageUrl: true } },
      _count: { select: { ticket: true } },
    },
  });
}

const hotelsRepository = {
  findAll,
  findById,
  findAvailableRooms,
  findRoomInfo,
  findBookedRoomByUserId,
};

export default hotelsRepository;
