import { Address, Enrollment, User } from '@prisma/client';

export type createUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type createEnrollment = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type createAddress = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
