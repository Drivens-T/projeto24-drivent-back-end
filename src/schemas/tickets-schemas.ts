import { BookRoomRequest, BookTicket } from '@/interfaces/createDataInterfaces';
import Joi from 'joi';

export const bookTicketSchema = Joi.object<BookTicket>({
  modalityId: Joi.number().min(1).required(),
  accommodationId: Joi.number().min(1),
  paid: Joi.boolean(),
});

export const bookHotelRoomSchema = Joi.object<BookRoomRequest>({
  roomId: Joi.number().strict(),
});
