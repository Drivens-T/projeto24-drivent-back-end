/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/user-repository';
import userService from '@/services/users-service';
import { exclude } from '@/utils/prisma-utils';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import qs from 'query-string';
import axios from 'axios';
import { invalidCredentialsError } from './errors';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function exchangeCodeForAccessToken(code: any) {
  const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const parsedData = qs.parse(data);
  return parsedData.access_token;
}

async function fetchUser(token: any) {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function loginGithub(email: string, password: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (!userWithSameEmail) {
    const hashedPassword = await bcrypt.hash(password, 12);

    await userService.createUser({ email, password: hashedPassword });
  }

  const result = await signIn({ email, password });

  return result;
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const authenticationService = {
  signIn,
  exchangeCodeForAccessToken,
  fetchUser,
  loginGithub,
};

export default authenticationService;
export * from './errors';
