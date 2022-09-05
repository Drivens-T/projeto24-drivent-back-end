import hotelsRepository from '@/repositories/hotel-repository/index';
import { formatHotelData } from '@/utils/hotels-utils';

export async function getAllHotels() {
  const hotels = await hotelsRepository.findAll();

  return hotels.map(formatHotelData);
}

export async function getHotelInfo(hotelId: number) {
  const hotel = await hotelsRepository.findById(hotelId);

  return formatHotelData(hotel);
}

export async function getBookedRoomInfo(userId: number) {
  const room = await hotelsRepository.findBookedRoomByUserId(userId);

  return room;
}

const hotelsService = { getAllHotels, getHotelInfo, getBookedRoomInfo };

export default hotelsService;
