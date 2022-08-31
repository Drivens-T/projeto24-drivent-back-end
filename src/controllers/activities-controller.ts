// import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
// import eventsService from '@/services/events-service';
import activitiesService from '@/services/activities-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getActivities(_req: Request, res: Response) {
  const activities = await activitiesService.getActivities();

  return res.status(httpStatus.OK).send(activities);
}
