import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
import hotelsService from '@/services/hotels-service/index';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getAllHotels(_req: Request, res: Response) {
  const hotels = await hotelsService.getAllHotels();

  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelInfo(_req: Request, res: Response) {
  const { hotelId } = _req.params;

  const hotel = await hotelsService.getHotelInfo(Number(hotelId));

  return res.status(httpStatus.OK).send(hotel);
}

export async function getBookedRoomInfo(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req;

  const room = await hotelsService.getBookedRoomInfo(userId);

  return res.status(httpStatus.OK).send(room);
}
