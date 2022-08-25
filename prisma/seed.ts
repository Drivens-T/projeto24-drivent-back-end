import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

import {
  CreateAccommodations,
  CreateAddress,
  CreateEnrollment,
  CreateModality,
  CreateUser,
} from './../src/interfaces/createDataInterfaces';

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
    { name: 'Com hotel', price: 150 },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
