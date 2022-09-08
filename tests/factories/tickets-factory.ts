import { Event, Modality, User } from '@prisma/client';

import { prisma } from '@/config';
import { createUser } from './users-factory';
import { createEvent } from './events-factory';
import { createModality } from './modalities-factory';

export async function createTicket(user?: User, event?: Event, modality?: Modality) {
  const incomingUser = user || (await createUser());
  const incomingEvent = event || (await createEvent());
  const incomingModality = modality || (await createModality(incomingEvent));

  return prisma.ticket.create({
    data: {
      userId: incomingUser.id,
      eventId: incomingEvent.id,
      modalityId: incomingModality.id,
    },
  });
}
