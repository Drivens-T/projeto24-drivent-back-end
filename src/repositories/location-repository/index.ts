import { prisma } from '@/config';

async function findAll() {
  return prisma.location.findMany();
}

const appRepository = {
  findAll,
};

export default appRepository;
