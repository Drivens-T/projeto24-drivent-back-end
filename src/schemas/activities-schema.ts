import Joi from 'joi';
import { CreateActivity } from '@/interfaces/createDataInterfaces';

export const activitySchema = Joi.object<CreateActivity>({});
