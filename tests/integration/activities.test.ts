/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import * as formats from '../../src/utils/formats-utils';
import { createUser } from '../factories';
import { createActivity } from '../factories/activities-factory';
import { createLocation } from '../factories/locations-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /activities', () => {
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
