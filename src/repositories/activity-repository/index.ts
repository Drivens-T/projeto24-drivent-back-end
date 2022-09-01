import { prisma } from '@/config/database';

async function findAll() {
  return prisma.activity.findMany({
    select: {
      id: true,
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

async function getActivity(id: number) {
  return prisma.activity.findFirst({
    where: { id },
  });
}

function registerOnActivity(userId: number, activityId: number) {
  return prisma.ticket.update({
    where: {
      userId,
    },
    data: {
      activities: {
        connect: { id: activityId },
      },
    },
  });
}

const activityRepository = {
  findAll,
  getActivity,
  registerOnActivity,
};

export default activityRepository;
