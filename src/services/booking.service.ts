import axiosClientFe from "@/helpers/call-fe";
import { BookingResponseData } from "@/types/booking";

interface params {
    limit?: number;
    page?: number;
}

export const getAllBookings = async (user_id: string, accessToken: string, params: params): Promise<BookingResponseData> => {
    try {
        const {limit = 20, page = 1} = params;
        const response = await axiosClientFe.get<BookingResponseData>(`/api/bookings`, {
            params: {
                limit,
                page
            },
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        return response.data;
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw error;
    }
};
