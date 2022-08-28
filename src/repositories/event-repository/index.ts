import { prisma } from '@/config';

async function findFirst() {
  return prisma.event.findFirst();
}

async function findModalitiesByEventId(eventId: number) {
  return prisma.modality.findMany({ where: { eventId }, select: { id: true, name: true, price: true } });
}

const eventRepository = {
  findFirst,
  findModalitiesByEventId,
};

export default eventRepository;
