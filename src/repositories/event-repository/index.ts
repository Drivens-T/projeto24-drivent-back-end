import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}

async function findModalitiesByEventId(eventId: number) {
  return prisma.modality.findMany({ where: { eventId }, select: { id: true, name: true, price: true } });
}

async function findEventModalityById(modalityId: number) {
  return prisma.modality.findUnique({ where: { id: modalityId } });
}

async function findOnlineModality() {
  return prisma.modality.findFirst({
    where: {
      name: 'Online',
    },
  });
}

const eventRepository = {
  findFirst,
  findModalitiesByEventId,
  findEventModalityById,
  findOnlineModality,
};

export default eventRepository;
