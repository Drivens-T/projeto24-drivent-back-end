import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { createUser } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma } from '@/config';

export async function cleanDb() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE "Address" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Enrollment" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Event" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "Session" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE modalities RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE accommodations RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE tickets RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE hotels RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE rooms RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE "roomTypes" RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE activities RESTART IDENTITY CASCADE`,
    prisma.$executeRaw`TRUNCATE TABLE locations RESTART IDENTITY CASCADE`,
  ]);
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
