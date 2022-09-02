import locationsService from '@/services/locations-services/index';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getAllLocations(_req: Request, res: Response) {
  const locations = await locationsService.getAllLocations();

  return res.status(httpStatus.OK).send(locations);
}
