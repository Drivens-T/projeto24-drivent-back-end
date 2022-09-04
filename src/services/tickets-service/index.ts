import { conflictError, invalidDataError, notFoundError } from '@/errors';
import { BookRoomRequest, BookTicket } from '@/interfaces/createDataInterfaces';
import eventRepository from '@/repositories/event-repository/index';
import hotelsRepository from '@/repositories/hotel-repository/index';
import ticketRepository from '@/repositories/ticket-repository/index';
import { exclude } from '@/utils/prisma-utils';
import { Event } from '@prisma/client';

async function getTicketInfo(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (!ticket) throw notFoundError();

  return exclude(ticket, 'createdAt', 'updatedAt');
}

export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

async function bookOrUpdateTicket(userId: number, eventId: number, data: BookTicket) {
  const modality = await eventRepository.findEventModalityById(data.modalityId);

  if (modality.name === 'Online' && data.accommodationId)
    throw invalidDataError(["You can't book accommodations to online modality"]);
  if (modality.name === 'Online') {
    data.accommodationId = null;
  }
  if (modality.name !== 'Online' && !data.accommodationId)
    throw invalidDataError(['When booking a presential modality ticket, you need to provide a type of accommodation']);

  const newData = { ...data, userId, eventId };
  const ticket = await ticketRepository.createOrUpdate(newData);

  return ticket;
}

async function bookHotelRoom(userId: number, eventId: number, data: BookRoomRequest) {
  const existingTicket = await ticketRepository.findTicketByUserId(userId);
  const { roomId } = data;

  const room = await hotelsRepository.findRoomInfo(roomId);

  if (room.roomType.capacity === room._count.ticket) throw conflictError('This room is full');

  const ticketToUpdate = { ...existingTicket, roomId };

  const updatedTicket = await ticketRepository.createOrUpdate(ticketToUpdate);

  return updatedTicket;
}

const ticketsService = {
  getTicketInfo,
  bookOrUpdateTicket,
  bookHotelRoom,
};

export default ticketsService;
