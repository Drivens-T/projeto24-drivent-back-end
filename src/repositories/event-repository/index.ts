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

const eventRepository = {
  findFirst,
  findModalitiesByEventId,
  findEventModalityById,
};

export default eventRepository;
