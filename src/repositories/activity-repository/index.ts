import { prisma } from '@/config/database';

async function findAll() {
  return prisma.activity.findMany({
    select: {
      name: true,
      location: {
        select: { name: true },
      },
      capacity: true,
      startTime: true,
      endTime: true,
      ticket: true,
    },
    orderBy: { startTime: 'asc' },
  });
}

const activityRepository = {
  findAll,
};

export default activityRepository;
