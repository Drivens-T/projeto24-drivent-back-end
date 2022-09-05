import { Router } from 'express';
import { authenticateToken, verifyUser } from '@/middlewares/authentication-middleware';
import { validateBody } from '@/middlewares/validation-middleware';
import { getActivities, registerOnActivity } from '@/controllers';
import { registerActivitySchema } from '@/schemas/activities-schema';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken, verifyUser)
  .get('/', getActivities)
  .post('/register', validateBody(registerActivitySchema), registerOnActivity);

export { activitiesRouter };
