import authenticationService, { SignInParams } from '@/services/authentication-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  const result = await authenticationService.signIn({ email, password });

  res.status(httpStatus.OK).send(result);
}

export async function authenticationGithub(req: Request, res: Response) {
  try {
    const token = await authenticationService.exchangeCodeForAccessToken(req.body.code);

    const user = await authenticationService.fetchUser(token);
    res.send(user);
  } catch (err) {
    res.sendStatus(500);
  }
}

export async function loginGithub(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await authenticationService.loginGithub(email, password);
  res.status(201).send(user);
}
