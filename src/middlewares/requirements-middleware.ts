import { invalidDataError } from '@/errors/invalid-data-error';
import enrollmentRepository from '@/repositories/enrollment-repository/index';
import ticketRepository from '@/repositories/ticket-repository/index';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './authentication-middleware';

export async function validateEnrollment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  const user = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!user.Address) throw invalidDataError(["Can't book ticket without enrollment"]);

  next();
}

export async function validatePayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  const user = await ticketRepository.findTicketByUserId(userId);

  if (!user.paid) throw invalidDataError(['This action requires payment first']);

  next();
}
