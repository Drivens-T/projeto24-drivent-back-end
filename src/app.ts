import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import 'reflect-metadata';

import { connectDb, disconnectDB, loadEnv } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  locationsRouter,
  activitiesRouter,
  hotelsRouter,
  accommodationsRouter,
  ticketsRouter,
} from '@/routers';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/accommodations', accommodationsRouter)
  .use('/ticket', ticketsRouter)
  .use('/locations', locationsRouter)
  .use('/activities', activitiesRouter)
  .use('/hotels', hotelsRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
