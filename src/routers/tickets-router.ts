import { Router } from 'express';
import { getTicketInfo, bookTicket } from '@/controllers';
import { authenticateToken, verifyUser } from '@/middlewares/authentication-middleware';
import { validateBody } from '@/middlewares/validation-middleware';
import { bookTicketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken, verifyUser)
  .get('/', getTicketInfo)
  .post('/book', validateBody(bookTicketSchema), bookTicket);

export { ticketsRouter };
