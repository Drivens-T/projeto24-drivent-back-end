import { Router } from 'express';
import { getDefaultEvent, getEventModalities } from '@/controllers';

const eventsRouter = Router();

eventsRouter.get('/', getDefaultEvent);
eventsRouter.get('/modalities', getEventModalities);

export { eventsRouter };
