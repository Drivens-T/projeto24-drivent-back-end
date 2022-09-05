import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
import activitiesService from '@/services/activities-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getActivities(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req;
  const activities = await activitiesService.getActivities(userId);

  return res.status(httpStatus.OK).send(activities);
}

export async function registerOnActivity(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req;
  const activityId: number = _req.body.id;

  await activitiesService.registerOnActivity(userId, activityId);

  return res.sendStatus(httpStatus.OK);
}
