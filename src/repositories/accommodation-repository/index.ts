import { prisma } from '@/config';

async function findAll() {
  return prisma.accommodation.findMany();
}

const accommodationRepository = {
  findAll,
};

export default accommodationRepository;
