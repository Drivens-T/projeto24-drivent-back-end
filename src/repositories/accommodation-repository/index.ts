import { prisma } from '@/config';

async function findAll() {
  return prisma.accommodation.findMany();
}

async function findById(accommodationId: number) {
  return prisma.accommodation.findUnique({ where: { id: accommodationId } });
}

const accommodationRepository = {
  findAll,
  findById,
};

export default accommodationRepository;
