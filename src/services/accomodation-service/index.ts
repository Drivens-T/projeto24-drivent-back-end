import accommodationRepository from '@/repositories/accommodation-repository/index';

async function getAllAccommodations() {
  const accommodations = await accommodationRepository.findAll();

  return accommodations;
}

const accommodationsService = {
  getAllAccommodations,
};

export default accommodationsService;
