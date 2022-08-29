import { Router } from 'express';
import { getAllAccommodations } from '@/controllers';

const accommodationsRouter = Router();

accommodationsRouter.get('/', getAllAccommodations);

export { accommodationsRouter };
