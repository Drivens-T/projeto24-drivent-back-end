import { Hotel, PrismaClient, Room, RoomType } from '@prisma/client';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

import { Accommodation, Address, Enrollment, Modality, User } from '@prisma/client';

type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreateEnrollment = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
type CreateAddress = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
type CreateModality = Omit<Modality, 'id'>;
type CreateAccommodations = Omit<Accommodation, 'id'>;
type CreateHotels = Omit<Hotel, 'id'>;
type CreateRoomType = Omit<RoomType, 'id'>;
type CreateRoom = Omit<Room, 'id' | 'hotelId'>;

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }
  console.log({ event });

  const modalities: CreateModality[] = [
    { name: 'Presencial', price: 250, eventId: 1 },
    { name: 'Online', price: 100, eventId: 1 },
  ];
  const createdModalities = await prisma.modality.createMany({ data: modalities });
  console.log({ createdModalities });

  const accommodations: CreateAccommodations[] = [
    { name: 'Sem hotel', price: 0 },
    { name: 'Com hotel', price: 350 },
  ];
  const createdAccommodations = await prisma.accommodation.createMany({ data: accommodations });
  console.log({ createdAccommodations });

  const roomTypes: CreateRoomType[] = [
    { name: 'Single', capacity: 1 },
    { name: 'Double', capacity: 2 },
    { name: 'Triple', capacity: 3 },
  ];
  const createdRoomTypes = await prisma.roomType.createMany({ data: roomTypes, skipDuplicates: true });
  console.log({ createdRoomTypes });
  function createRooms(roomAmount: number): CreateRoom[] {
    const rooms: CreateRoom[] = [];

    for (let i = 1; i <= roomAmount; i++) {
      const roomTypeId = Math.ceil(Math.random() * roomTypes.length);
      rooms.push({ roomNumber: i, roomTypeId });
    }

    return rooms;
  }

  const hotels: (CreateHotels & { rooms: CreateRoom[] })[] = [
    {
      name: 'Driven Resort',
      imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
      rooms: createRooms(40),
    },
    {
      name: 'Driven Palace',
      imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/23/cf/4d/da/hotel-exterior.jpg',
      rooms: createRooms(30),
    },
    {
      name: 'Driven World',
      imageUrl:
        'https://imgcy.trivago.com/c_lfill,d_dummy.jpeg,e_sharpen:60,f_auto,h_450,q_auto,w_450/itemimages/96/95/96959_v6.jpeg',
      rooms: createRooms(20),
    },
  ];
  const createdHotels = await Promise.all(
    hotels.map((hotel) => {
      return prisma.hotel.create({
        data: {
          name: hotel.name,
          imageUrl: hotel.imageUrl,
          rooms: {
            createMany: {
              data: hotel.rooms,
            },
          },
        },
      });
    }),
  );
  console.log({ createdHotels });

  const user: CreateUser = {
    email: 'user@test.com',
    password: await bcrypt.hash('user1234', 10),
  };
  const userEnrollment: CreateEnrollment = {
    birthday: new Date('1990, 01, 01'),
    cpf: '111111111111',
    name: 'John Doe',
    phone: '+55 99 99999-9999',
  };
  const userAddress: CreateAddress = {
    cep: '11111-111',
    street: 'Random Street',
    city: 'Random city',
    state: 'RJ',
    number: '1',
    neighborhood: 'Random Neighborhood',
    addressDetail: 'Random address detail',
  };

  const createdUser = await prisma.user.create({
    data: { ...user, Enrollment: { create: { ...userEnrollment, Address: { create: { ...userAddress } } } } },
  });
  console.log({ createdUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
