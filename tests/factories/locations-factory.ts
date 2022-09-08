import faker from '@faker-js/faker';

import { prisma } from '@/config';

export async function createLocation() {
  return prisma.location.create({
    data: {
      name: faker.name.findName(),
    },
  });
}
