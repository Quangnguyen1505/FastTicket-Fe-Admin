import axiosClientFe from "@/helpers/call-fe";
import { GetAllRoomsResponse, Room, RoomRequestData } from "@/types/rooms";


export const getAllRooms = async ({
    limit = 50,
    page = 1
}): Promise<GetAllRoomsResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllRoomsResponse>(`/api/rooms`, {
        params: {
          limit,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all rooms:", error);
      throw error;
    }
};

export const getDetailRooms = async (roomId: string): Promise<Room> => {
    try {
      const response = await axiosClientFe.get<Room>(`/api/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all rooms:", error);
      throw error;
    }
};

export const createRooms = async (user_id: string, accessToken: string, newRooms: RoomRequestData) => {
  try {
      const response = await axiosClientFe.post(`/api/rooms`, newRooms, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken
          }
      });
      console.log("response ", response);
      return response;  
  } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;  
  }
};


export const updateRooms = async (user_id: string, accessToken: string, roomId: string, editRooms: RoomRequestData) => {
  try {
      const response = await axiosClientFe.put(`/api/rooms/${roomId}`, editRooms, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken
          }
      });
      console.log("response ", response)
      return response;  
  } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;  
  }
}

export const deleteRooms = async (user_id: string, accessToken: string, roomId: string) => {
  try {        
      const response = await axiosClientFe.delete(`/api/rooms/${roomId}`, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken
          }
      });
      console.log("response ", response)
      return response;  
  } catch (error) {
      console.error('Error deleting category:', error);
      throw error;  
  }
}