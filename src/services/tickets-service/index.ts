import { notFoundError } from '@/errors';
import { CreateTicket } from '@/interfaces/createDataInterfaces';
import ticketRepository from '@/repositories/ticket-repository/index';
import { Event } from '@prisma/client';

async function getTicketInfo(userId: number) {
  const ticket = await ticketRepository;
  if (!ticket) throw notFoundError();

  // return exclude(event, 'createdAt', 'updatedAt');
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function bookOrUpdateTicket(userId: number, eventId: number, data: CreateTicket) {
  return;
}

const ticketsService = {
  getTicketInfo,
  bookOrUpdateTicket,
};

export default ticketsService;
