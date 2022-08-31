/* eslint-disable no-console */
// import { invalidDataError, notFoundError } from '@/errors';
// import { CreateActivity } from '@/interfaces/createDataInterfaces';
// import eventRepository from '@/repositories/event-repository/index';
// import { Event } from '@prisma/client';
// import { exclude } from '@/utils/prisma-utils';
import activityRepository from '@/repositories/activity-repository/index';

async function getActivities() {
  const activities = await activityRepository.findAll();

  return activities;
}

const activitiesService = {
  getActivities,
};

export default activitiesService;
