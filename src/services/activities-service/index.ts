/* eslint-disable @typescript-eslint/no-explicit-any */
import { conflictError, fullCapacityError, notFoundError } from '@/errors';
import activityRepository from '@/repositories/activity-repository/index';
import { formatDate, formatDateTimestamp } from '@/utils/formats-utils';
import { exclude } from '@/utils/prisma-utils';

async function getActivities(userId: number) {
  const allActivities = await activityRepository.findAll();
  const activities = allActivities.map((activity) => {
    const capacity = activity.capacity - activity._count.ticket;
    const isRegister = activity.ticket.some((ticket) => ticket.User.id === userId);
    const startTime = formatDateTimestamp(activity.startTime);
    const endTime = formatDateTimestamp(activity.endTime);
    return exclude({ ...activity, startTime, endTime, capacity, isRegister }, '_count', 'ticket');
  });
  const activitiesDate = getDays(allActivities);

  return { activities, activitiesDate };
}

async function registerOnActivity(userId: number, activityId: number) {
  const activityData = await activityRepository.getActivity(activityId);
  if (!activityData) {
    throw notFoundError();
  }
  const capacity = activityData.capacity - activityData._count.ticket;
  if (capacity <= 0) {
    throw fullCapacityError();
  }
  if (await hasTimeConflict(activityData, userId)) {
    throw conflictError('Time conflict');
  }
  await activityRepository.registerOnActivity(userId, activityId);
}

function getDays(allActivities: any) {
  const aux = [];
  const hash: any = {};
  for (let i = 0; i < allActivities.length; i++) {
    const { startTime } = allActivities[i];
    const date = formatDate(startTime);
    if (hash[date]) continue;
    hash[date] = true;
    aux.push(date);
  }
  return aux;
}

async function hasTimeConflict(activityData: any, userId: number) {
  const startTime = formatDateTimestamp(activityData.startTime);
  const endTime = formatDateTimestamp(activityData.endTime);
  const selectedActivity = { ...activityData, startTime, endTime };
  const allActivities = (await getActivities(userId)).activities;
  const registerActivities = allActivities.filter(
    (activity) =>
      activity.isRegister === true &&
      startTime.split(' ')[0] === activity.startTime.split(' ')[0] &&
      selectedActivity.id !== activity.id,
  );
  for (let i = 0; i < registerActivities.length; i++) {
    const registerActivityStartTime = registerActivities[i].startTime.split(' ')[1];
    const registerActivityEndTime = registerActivities[i].endTime.split(' ')[1];
    const activityStartTime = startTime.split(' ')[1];
    const activityEndTime = endTime.split(' ')[1];
    const conditions =
      (activityStartTime < registerActivityStartTime && activityEndTime <= registerActivityStartTime) ||
      (activityStartTime >= registerActivityEndTime && activityEndTime > registerActivityEndTime);
    if (!conditions) {
      return true;
    }
  }
  return false;
}

const activitiesService = {
  getActivities,
  registerOnActivity,
};

export default activitiesService;
