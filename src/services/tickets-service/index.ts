import { invalidDataError, notFoundError } from '@/errors';
import { CreateTicket } from '@/interfaces/createDataInterfaces';
import eventRepository from '@/repositories/event-repository/index';
import ticketRepository from '@/repositories/ticket-repository/index';
import { exclude } from '@/utils/prisma-utils';
import { Event } from '@prisma/client';

async function getTicketInfo(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (!ticket) throw notFoundError();

  return exclude(ticket, 'createdAt', 'updatedAt');
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function bookOrUpdateTicket(userId: number, eventId: number, data: CreateTicket) {
  const modality = await eventRepository.findEventModalityById(data.modalityId);

  if (modality.name === 'Online' && data.accommodationId)
    throw invalidDataError(["You can't book accommodations to online modality"]);

  const newData = { ...data, userId, eventId };
  const ticket = await ticketRepository.createOrUpdate(newData);

  return ticket;
}

const ticketsService = {
  getTicketInfo,
  bookOrUpdateTicket,
};

export default ticketsService;
