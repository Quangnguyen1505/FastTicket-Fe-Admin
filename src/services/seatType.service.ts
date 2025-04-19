import axiosClientFe from "@/helpers/call-fe";
import { GetAllSeatTypesResponse, SeatTypeRequestCreate } from "@/types/seat-type";

export const getAllSeatType = async (): Promise<GetAllSeatTypesResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllSeatTypesResponse>(`/api/rooms/seat-types`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all seat types:", error);
      throw error;
    }
};

export const createSeatTypes = async (user_id: string, accessToken: string, newSeatType: SeatTypeRequestCreate) => {
    try {
        console.log("userid and acces", user_id, accessToken);
        
        const response = await axiosClientFe.post(`/api/rooms/seat-types`, newSeatType, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error create seat types:', error);
        throw error;  
    }
}

export const updateSeatTypes = async (user_id: string, accessToken: string, seatTypeId: string, editSeatType: SeatTypeRequestCreate) => {
    try {
        const response = await axiosClientFe.put(`/api/rooms/seat-types/${seatTypeId}`, editSeatType, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error update seat types:', error);
        throw error;  
    }
}

export const deleteSeatTypes = async (user_id: string, accessToken: string, seatTypeId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/rooms/seat-types/${seatTypeId}`, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error deleting seat types:', error);
        throw error;  
    }
}
