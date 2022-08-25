import { Accommodation, Address, Enrollment, Modality, User } from '@prisma/client';

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEnrollment = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type CreateAddress = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type CreateModality = Omit<Modality, 'id'>;
export type CreateAccommodations = Omit<Accommodation, 'id'>;
