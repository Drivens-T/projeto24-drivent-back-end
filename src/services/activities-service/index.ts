import { invalidDataError } from '@/errors';
import activityRepository from '@/repositories/activity-repository/index';

async function getActivities() {
  const activities = await activityRepository.findAll();

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
