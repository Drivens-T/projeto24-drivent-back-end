import eventsService from '@/services/events-service';
import ticketsService from '@/services/tickets-service/index';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketInfo(_req: Request, res: Response) {
  const event = await eventsService.getFirstEvent();

  return res.status(httpStatus.OK).send(event);
}

export async function bookTicket(_req: Request, res: Response) {
  const userId: number = res.locals.userId;

  const event = await eventsService.getFirstEvent();
  const modalities = await ticketsService.bookOrUpdateTicket(userId, event.id, _req.body);

  return res.status(httpStatus.OK).send(modalities);
}
