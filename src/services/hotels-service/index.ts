import hotelsRepository from '@/repositories/hotel-repository/index';
import { formatHotelData } from '@/utils/hotels-utils';

export async function getAllHotels() {
  const hotels = await hotelsRepository.findAll();

  return formatHotelData(hotels);
}

export async function getHotelAvailableRooms(hotelId: number) {
  const rooms = await hotelsRepository.findAvailableRooms(hotelId);

  return rooms;
}

const hotelsService = { getAllHotels, getHotelAvailableRooms };

export default hotelsService;
