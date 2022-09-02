/* eslint-disable @typescript-eslint/no-explicit-any */
import { fullCapacityError, invalidDataError } from '@/errors';
import activityRepository from '@/repositories/activity-repository/index';
import { formatDate } from '@/utils/formats-utils';
import { exclude } from '@/utils/prisma-utils';

async function getActivities(userId: number) {
  const allActivities = await activityRepository.findAll();
  const activities = allActivities.map((activity) => {
    const capacity = activity.capacity - activity._count.ticket;
    const isRegister = activity.ticket.some((ticket) => ticket.User.id === userId);
    return exclude({ ...activity, capacity, isRegister }, '_count', 'ticket');
  });
  const activitiesDate = getDays(allActivities);

  return { activities, activitiesDate };
}

async function registerOnActivity(userId: number, activityId: number) {
  const activityData = await activityRepository.getActivity(activityId);
  if (!activityData) {
    throw invalidDataError(['This activity does not exist']);
  }
  const capacity = activityData.capacity - activityData._count.ticket;
  if (capacity <= 0) {
    throw fullCapacityError();
  }
  await activityRepository.registerOnActivity(userId, activityId);
}

function getDays(allActivities: any) {
  const aux = [];
  let lastDate;
  for (let i = 0; i < allActivities.length; i++) {
    const activity = allActivities[i];
    const date = formatDate(activity.startTime);
    if (date === lastDate) continue;
    lastDate = date;
    aux.push(date);
  }
  return aux;
}

const activitiesService = {
  getActivities,
  registerOnActivity,
};

export default activitiesService;
