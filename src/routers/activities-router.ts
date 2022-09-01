import { Router } from 'express';
import { authenticateToken, verifyUser } from '@/middlewares/authentication-middleware';
// import { validateBody } from '@/middlewares/validation-middleware';
import { getActivities } from '@/controllers';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken, verifyUser).get('/', getActivities);

export { activitiesRouter };
