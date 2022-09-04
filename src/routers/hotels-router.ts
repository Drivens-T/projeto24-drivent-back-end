import { getAllHotels } from '@/controllers/hotels-controller';
import { bookHotelRoom } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares/authentication-middleware';
import { validateBody } from '@/middlewares/validation-middleware';
import { bookHotelRoomSchema } from '@/schemas/tickets-schemas';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter.get('/', getAllHotels).post('/book', authenticateToken, validateBody(bookHotelRoomSchema), bookHotelRoom);

export { hotelsRouter };
