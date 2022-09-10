import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { createUser } from '../factories';
import { createTicket } from '../factories/tickets-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /tickets', () => {
  beforeAll(async () => {
    await init();
    await cleanDb();
  });

  describe('when authentication is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/ticket');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const response = await server.get('/ticket').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get('/ticket').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should get tickets informations', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicket(user);

      const response = await server.get('/ticket').set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.OK);
      expect(typeof response).toBe('object');
      expect(response).not.toBeNull();
    });

    it('should not get tickets informations', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/ticket').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST /tickets', () => {
  beforeAll(async () => {
    await init();
    await cleanDb();
  });

    it('should not book tickets with an invalid body, return 400', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicket(user);

      const response = await server.post('/ticket/book').set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
});