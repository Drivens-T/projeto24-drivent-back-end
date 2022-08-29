import { CreateTicket } from '@/interfaces/createDataInterfaces';
import Joi from 'joi';

export const bookTicketSchema = Joi.object<CreateTicket>({
  modalityId: Joi.number().min(1).required(),
  accommodationId: Joi.number().min(1),
  paid: Joi.boolean(),
});
