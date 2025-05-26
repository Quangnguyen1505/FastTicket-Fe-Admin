export interface SeatTypeRoom {
    seat_type_id: string;
    quantity: number;
    Seat_type: { name: string }
}

export interface Room {
    id: string;
    room_name: string;
    room_seat_quantity: number;
    room_status: boolean;
    room_release_date: string;
    Room_seat_types: SeatTypeRoom[];
}

export interface GetAllRoomsResponse {
    message: string;
    status: number;
    metadata: Room[];
}

export interface SeatTypeRoomRequest {
    type: string;
    quantity: number
}

export interface RoomRequestData {
    room_name: string;
    room_seat: SeatTypeRoomRequest[];
    room_seat_quantity: number;
    room_release_date: Date
}
  