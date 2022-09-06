/* eslint-disable @typescript-eslint/no-unused-vars */
import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import faker from '@faker-js/faker';
import dayjs from 'dayjs';
import { createUser } from '../factories';
import * as jwt from 'jsonwebtoken';

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
});
