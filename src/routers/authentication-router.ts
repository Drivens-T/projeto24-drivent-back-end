import { singInPost, authenticationGithub, loginGithub } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';
import { Router } from 'express';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.post('/login', authenticationGithub);
authenticationRouter.post('/usergithub', loginGithub);

export { authenticationRouter };
