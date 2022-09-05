import { Accommodation, Address, Enrollment, Modality, Ticket, User, Location, Activity } from '@prisma/client';

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEnrollment = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type CreateAddress = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type CreateModality = Omit<Modality, 'id'>;
export type CreateAccommodations = Omit<Accommodation, 'id'>;
export type CreateTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateTicketSchema = Omit<Ticket, 'id' | 'userId' | 'eventId' | 'createdAt' | 'updatedAt'>;
export type CreateLocation = Omit<Location, 'id'>;
export type CreateActivity = Omit<Activity, 'id'>;
export type CreateActivityRegister = Omit<Activity, 'name' | 'locationId' | 'startTime' | 'endTime' | 'capacity'>;

// export type AppInsertData = CreateAccommodations | CreateLocation;
// export type Table = 'accommodation' | 'location';
