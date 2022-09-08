import { getAllHotels, getBookedRoomInfo, getHotelInfo } from '@/controllers/hotels-controller';
import { bookHotelRoom } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares/authentication-middleware';
import { validateEnrollment, validatePayment } from '@/middlewares/requirements-middleware';
import { validateBody } from '@/middlewares/validation-middleware';
import { bookHotelRoomSchema } from '@/schemas/tickets-schemas';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter
  .get('/', getAllHotels)
  .get('/hotel/:hotelId', getHotelInfo)
  .get('/room', authenticateToken, getBookedRoomInfo)
  .post(
    '/book',
    authenticateToken,
    validateBody(bookHotelRoomSchema),
    validateEnrollment,
    validatePayment,
    bookHotelRoom,
  );

export { hotelsRouter };
