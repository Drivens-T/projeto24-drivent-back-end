import { ApplicationError } from '@/protocols';

export function fullCapacityError(): ApplicationError {
  return {
    name: 'fullCapacityError',
    message: 'This activity is already full',
  };
}
