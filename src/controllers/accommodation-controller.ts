import { accommodationsService } from '@/services/index';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getAllAccommodations(_req: Request, res: Response) {
  const accommodations = await accommodationsService.getAllAccommodations();

  return res.status(httpStatus.OK).send(accommodations);
}
