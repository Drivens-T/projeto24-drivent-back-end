import { PrismaClient, Accommodation, Address, Enrollment, Modality, User, Location, Activity } from '@prisma/client';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { createClient } from 'redis';
const prisma = new PrismaClient();

type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreateEnrollment = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
type CreateAddress = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
type CreateModality = Omit<Modality, 'id'>;
type CreateAccommodations = Omit<Accommodation, 'id'>;
type CreateLocation = Omit<Location, 'id'>;
type CreateActivity = Omit<Activity, 'id'>;

async function connectRedis(redis: any) {
  await redis.connect();
}
const redis = createClient({
  url: process.env.REDIS_URL,
});
connectRedis(redis);

async function main() {
  const cacheKey = 'event';
  const cachedEvent = await redis.get(cacheKey);
  if (cachedEvent) {
    const event = await prisma.event.create({
      data: JSON.parse(cachedEvent),
    });
    console.log({ cachedEvent: event });
  } else {
    let event = await prisma.event.findFirst();
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
    redis.set(cacheKey, JSON.stringify(event));
    console.log({ event });
  }

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

  const locations: CreateLocation[] = [
    { name: 'Auditório Principal' },
    { name: 'Auditório Lateral' },
    { name: 'Sala de Workshop' },
  ];

  const createdLocations = await prisma.location.createMany({ data: locations });

  console.log({ createdLocations });

  const activities: CreateActivity[] = [
    {
      name: 'GTA V: montando o PC ideal',
      locationId: 1,
      startTime: dayjs('2022-10-22 09:00').toDate(),
      endTime: dayjs('2022-10-22 10:00').toDate(),
      capacity: 30,
    },
    {
      name: 'Dota 2: montando o PC ideal',
      locationId: 1,
      startTime: dayjs('2022-10-22 10:00').toDate(),
      endTime: dayjs('2022-10-22 11:00').toDate(),
      capacity: 1,
    },
    {
      name: 'Palestra 1',
      locationId: 2,
      startTime: dayjs('2022-10-23 09:00').toDate(),
      endTime: dayjs('2022-10-23 11:00').toDate(),
      capacity: 20,
    },
    {
      name: 'Palestra 2',
      locationId: 2,
      startTime: dayjs('2022-10-24 09:00').toDate(),
      endTime: dayjs('2022-10-24 10:00').toDate(),
      capacity: 10,
    },
    {
      name: 'Palestra 3',
      locationId: 3,
      startTime: dayjs('2022-10-24 09:00').toDate(),
      endTime: dayjs('2022-10-24 10:00').toDate(),
      capacity: 10,
    },
  ];

  const createdActivities = await prisma.activity.createMany({ data: activities });

  console.log({ createdActivities });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
