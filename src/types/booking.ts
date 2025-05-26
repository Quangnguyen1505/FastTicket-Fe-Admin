export interface Room {
    id: string;
    room_name: string;
}
  
export interface Movie {
    id: string;
    movie_title: string;
    movie_image_url: string;
}
export interface User {
    id: string;
    usr_first_name: string;
    usr_last_name: string;
    usr_email: string;
}
  
export interface Showtime {
    id: string;
    show_date: string;
    end_time: string;
}
  
export interface Seat {
    seat_row: string;
    seat_number: string;
    seat_status: string;
}
  
export interface BookingSeat {
    seat_id: string;
    Seat: Seat[];
}
  
export interface Booking {
    id: string
    booking_roomId: string;
    booking_movieId: string;
    booking_userId: string;
    booking_date: string;
    booking_total_checkout: number;
    booking_status: string;
    booking_show_time_id: string;
    payment_method: string;
    payment_order_id: string;
    payment_transaction_id: string;
    payment_result_code: string;
    payment_message: string;
    Room: Room;
    Movie: Movie;
    User: User;
    Showtime: Showtime;
    booking_seats: BookingSeat;
}
  
export interface BookingResponseData {
    message: string;
    status: number;
    metadata: Booking[];
}
  