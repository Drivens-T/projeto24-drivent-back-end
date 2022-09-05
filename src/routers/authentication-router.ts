import { singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';
import { Router } from 'express';
import qs from 'query-string';
import axios from 'axios';
import bcrypt from 'bcrypt';
import userRepository from '@/repositories/user-repository';
import userService from '@/services/users-service';
import authenticationService, { SignInParams } from '@/services/authentication-service';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.post('/login', async (req, res) => {
  try {
    const token = await exchangeCodeForAccessToken(req.body.code);
    console.log('token', token);

    const user = await fetchUser(token);
    res.send(user);
  } catch (err) {
    console.log('err', err.response);
    res.sendStatus(500);
  }
});

authenticationRouter.post('/usergithub', async (req, res) => {
  const { email, password } = req.body;

  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    const result = await authenticationService.signIn({ email, password });

    res.status(200).send(result);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  console.log(hashedPassword, email);

  const usuario = await userService.createUser({ email, password });
  res.status(201).json({
    id: usuario.id,
    email: usuario.email,
  });

});

async function exchangeCodeForAccessToken(code: any) {
  const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
  const params = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:4000',
    client_id: '035e8d2190f6b1c068bb',
    client_secret: 'fe1ddc4b73f618d685a01a91e6e5511771e189c6',
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

export { authenticationRouter };
