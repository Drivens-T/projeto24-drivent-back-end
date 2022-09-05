export function formatHotelData(hotel: HotelWithCount) {
  const roomTypes: string[] = [];
  let availableVacancies = 0;
  const formattedRooms = hotel['rooms'].map((room): FormattedRoom => {
    if (!roomTypes.includes(room.roomType.name)) roomTypes.push(room.roomType.name);

    const bookedBeds = room._count.ticket;
    const roomCapacity = room.roomType.capacity;
    const availableBeds = roomCapacity - bookedBeds;

    if (availableBeds > 0) availableVacancies += availableBeds;

    return { ...room, availableBeds };
  });

  roomTypes.sort();

  return { ...hotel, rooms: formattedRooms, roomTypes, availableVacancies };
}

interface HotelWithCount {
  id: number;
  name: string;
  imageUrl: string;
  rooms: {
    _count: {
      ticket: number;
    };
    roomType: {
      name: string;
      capacity: number;
    };
    roomNumber: number;
  }[];
}

interface FormattedRoom {
  _count: {
    ticket: number;
  };
  roomType: {
    name: string;
    capacity: number;
  };
  availableBeds: number;
  roomNumber: number;
}
