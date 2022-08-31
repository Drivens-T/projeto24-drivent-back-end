import { prisma } from '@/config/database';

async function findAll() {
  return prisma.activity.findMany({
    orderBy: { startTime: 'asc' },
  });
}

const activityRepository = {
  findAll,
};

export default activityRepository;
