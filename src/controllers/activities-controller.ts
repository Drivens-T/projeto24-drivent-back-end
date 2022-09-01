import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';
import activitiesService from '@/services/activities-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getActivities(_req: Request, res: Response) {
  const activities = await activitiesService.getActivities();

  return res.status(httpStatus.OK).send(activities);
}

export async function registerOnActivity(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req;
  const activityId: number = _req.body.id;

  await activitiesService.registerOnActivity(userId, activityId);

  return res.sendStatus(httpStatus.OK);
}
