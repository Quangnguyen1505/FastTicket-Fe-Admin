import axiosClientFe from "@/helpers/call-fe";
import { GetAllEventsResponse, GetDetailsEventResponse } from "@/types/events";


export const getAllEvents = async ({
    limit = 50,
    page = 1,
}): Promise<GetAllEventsResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllEventsResponse>(`/api/events`, {
        params: {
          limit,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw error;
    }
};

export const getDetailEvent = async (eventId: string): Promise<GetDetailsEventResponse> => {
    try {
      const response = await axiosClientFe.get<GetDetailsEventResponse>(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all rooms:", error);
      throw error;
    }
};

export const createEvents = async (user_id: string, accessToken: string, newEvents: FormData): Promise<GetDetailsEventResponse> => {
  try {
      const response = await axiosClientFe.post<GetDetailsEventResponse>(`/api/events`, newEvents, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken,
              'Content-Type': 'multipart/form-data' 
          }
      });
      console.log("response ", response);
      return response.data;  
  } catch (error) {
      console.error('Error create event:', error);
      throw error;  
  }
};


export const updateEvents = async (user_id: string, accessToken: string, eventId: string, editEvents: FormData) => {
  try {
      const response = await axiosClientFe.put(`/api/events/${eventId}`, editEvents, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken,
              'Content-Type': 'multipart/form-data' 
          }
      });
      console.log("response ", response)
      return response;  
  } catch (error) {
      console.error('Error update event:', error);
      throw error;  
  }
}

export const deleteEvents = async (user_id: string, accessToken: string, eventId: string) => {
  try {        
      const response = await axiosClientFe.delete(`/api/events/${eventId}`, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken
          }
      });
      console.log("response ", response)
      return response;  
  } catch (error) {
      console.error('Error deleting events:', error);
      throw error;  
  }
}