import { invalidDataError } from '@/errors';
import activityRepository from '@/repositories/activity-repository/index';
import { exclude } from '@/utils/prisma-utils';

async function getActivities() {
  const allActivities = await activityRepository.findAll();
  const activities = allActivities.map((activity) => {
    const capacity = activity.capacity - activity._count.ticket;
    return exclude({ ...activity, capacity }, '_count');
  });

  return activities;
}

async function registerOnActivity(userId: number, activityId: number) {
  const activityData = await activityRepository.getActivity(activityId);
  if (!activityData) {
    throw invalidDataError(['This activity does not exist']);
  }
  await activityRepository.registerOnActivity(userId, activityId);
}

const activitiesService = {
  getActivities,
  registerOnActivity,
};

export default activitiesService;
