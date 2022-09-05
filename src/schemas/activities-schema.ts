import Joi from 'joi';
import { CreateActivityRegister } from '@/interfaces/createDataInterfaces';

export const registerActivitySchema = Joi.object<CreateActivityRegister>({
  id: Joi.number().integer().min(1).required(),
});
