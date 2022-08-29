import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
import eventsService from '@/services/events-service';
import ticketsService from '@/services/tickets-service/index';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketInfo(_req: AuthenticatedRequest, res: Response) {
  // const userId: number = res.locals.userId;
  const { userId } = _req;

  const event = await ticketsService.getTicketInfo(userId);

  return res.status(httpStatus.OK).send(event);
}

export async function bookTicket(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req;

  const event = await eventsService.getFirstEvent();

  const ticket = await ticketsService.bookOrUpdateTicket(userId, event.id, _req.body);

  return res.status(httpStatus.OK).send(ticket);
}
