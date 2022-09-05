import appRepository from '@/repositories/location-repository/index';

async function getAllLocations() {
  const locations = await appRepository.findAll();

  return locations;
}

const locationsService = {
  getAllLocations,
};

export default locationsService;
