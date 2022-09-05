import accommodationRepository from '@/repositories/accommodation-repository/index';

async function getAllAccommodations() {
  const accommodations = await accommodationRepository.findAll();

  return accommodations;
}

export const accommodationsService = {
  getAllAccommodations,
};

export default accommodationsService;
