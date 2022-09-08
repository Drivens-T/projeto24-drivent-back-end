import app, { close, init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import * as formats from '../../src/utils/formats-utils';
import { createUser } from '../factories';
import { createActivity, createFullActivity } from '../factories/activities-factory';
import { createLocation } from '../factories/locations-factory';
import { createTicket } from '../factories/tickets-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /activities', () => {
  beforeAll(async () => {
    await init();
    await cleanDb();
  });

  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and activities data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const location = await createLocation();
      const activity = await createActivity(location);

      const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        activities: [
          {
            id: activity.id,
            name: activity.name,
            location: { name: location.name },
            capacity: activity.capacity,
            startTime: formats.formatDateTimestamp(activity.startTime),
            endTime: formats.formatDateTimestamp(activity.endTime),
            isRegister: false,
          },
        ],
        activitiesDate: [formats.formatDate(activity.startTime)],
      });
    });
  });
});

describe('POST /activities/register', () => {
  beforeAll(async () => {
    await init();
    await cleanDb();
  });

  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/activities/register');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when body is not present', async () => {
      const token = await generateValidToken();

      const response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when body is not valid', async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe('when body is valid', () => {
    const generateValidBody = (id: number) => ({
      id,
    });

    it('should respond with status 200 and connect user to the activity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicket(user);
      const activityData = await createActivity();
      const { id } = activityData;
      const body = generateValidBody(id);

      let response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.OK);

      response = await server.get('/activities').set('Authorization', `Bearer ${token}`);
      expect(response.body.activities[0].isRegister).toBe(true);
    });

    it('should respond with status 404 when activityId is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicket(user);
      const activityData = await createActivity();
      const { id } = activityData;
      const body = generateValidBody(id + 1000);

      const response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 400 when activity is full', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicket(user);
      const activityData = await createFullActivity();
      const { id } = activityData;
      const body = generateValidBody(id);

      const response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 409 when has time conflict', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicket(user);
      const activityData1 = await createActivity();
      const activityData2 = await createActivity();
      const body1 = generateValidBody(activityData1.id);
      const body2 = generateValidBody(activityData2.id);

      let response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`).send(body1);
      response = await server.post('/activities/register').set('Authorization', `Bearer ${token}`).send(body2);
      expect(response.status).toBe(httpStatus.CONFLICT);
    });
  });
});

afterAll(async () => {
  await close();
});
