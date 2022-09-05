import eventsService from '@/services/events-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { createClient } from 'redis';
import { connectRedis } from '@/config';

const redis = createClient({
  url: process.env.REDIS_URL,
});
connectRedis(redis);

export async function getDefaultEvent(_req: Request, res: Response) {
  const cacheKey = 'event';
  const cachedEvent = await redis.get(cacheKey);
  if (cachedEvent) {
    return res.send(JSON.parse(cachedEvent));
  }
  const event = await eventsService.getFirstEvent();
  redis.set(cacheKey, JSON.stringify(event));
  return res.status(httpStatus.OK).send(event);
}

export async function getEventModalities(_req: Request, res: Response) {
  const event = await eventsService.getFirstEvent();
  const modalities = await eventsService.getEventModalities(event.id);

  return res.status(httpStatus.OK).send(modalities);
}
