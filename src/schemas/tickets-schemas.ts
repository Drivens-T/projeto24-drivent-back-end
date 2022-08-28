import { CreateTicket } from '@/interfaces/createDataInterfaces';
import Joi from 'joi';

export const bookTicketSchema = Joi.object<CreateTicket>({
  accommodationId: Joi.number().min(1).required(),
  modalityId: Joi.number().min(1).required(),
  paid: Joi.boolean(),
});
