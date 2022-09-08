import faker from '@faker-js/faker';

import { prisma } from '@/config';
import { Event } from '@prisma/client';
import { createEvent } from './events-factory';

export async function createModality(event?: Event) {
  const incomingEvent = event || (await createEvent());
  return prisma.modality.create({
    data: {
      name: faker.name.findName(),
      price: +faker.random.numeric(3),
      eventId: incomingEvent.id,
    },
  });
}
