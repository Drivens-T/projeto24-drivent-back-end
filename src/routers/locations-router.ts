import { Router } from 'express';
import { getAllLocations } from '@/controllers';

const locationsRouter = Router();

locationsRouter.get('/', getAllLocations);

export { locationsRouter };
