import { prisma } from '@/config/database';
import { BookTicket } from '@/interfaces/createDataInterfaces';

function findTicketByUserId(userId: number) {
  return prisma.ticket.findUnique({ where: { userId } });
}

function createOrUpdate(data: BookTicket) {
  return prisma.ticket.upsert({
    where: {
      userId: data.userId,
    },
    update: {
      ...data,
    },
    create: {
      ...data,
    },
  });
}

const ticketRepository = {
  findTicketByUserId,
  createOrUpdate,
};

export default ticketRepository;
