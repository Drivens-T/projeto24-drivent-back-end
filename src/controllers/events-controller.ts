import eventsService from '@/services/events-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getDefaultEvent(_req: Request, res: Response) {
  const event = await eventsService.getFirstEvent();

  return res.status(httpStatus.OK).send(event);
}

export async function getEventModalities(_req: Request, res: Response) {
  const event = await eventsService.getFirstEvent();
  const modalities = await eventsService.getEventModalities(event.id);

  return res.status(httpStatus.OK).send(modalities);
}
