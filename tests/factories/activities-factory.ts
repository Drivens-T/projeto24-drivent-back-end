import faker from '@faker-js/faker';
import { Location } from '@prisma/client';
import dayjs from 'dayjs';

import { prisma } from '@/config';
import { createLocation } from './locations-factory';

export async function createActivity(location?: Location) {
  const incomingLocation = location || (await createLocation());

  return prisma.activity.create({
    data: {
      name: faker.name.findName(),
      locationId: incomingLocation.id,
      startTime: dayjs('2022-10-22 09:00').toDate(),
      endTime: dayjs('2022-10-22 10:00').toDate(),
      capacity: +faker.random.numeric(2),
    },
  });
}
