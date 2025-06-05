import axiosClientFe from "@/helpers/call-fe";
import { GetAllShowTimesResponse, GetDetailesShowTimesResponse, ShowTimeRequestData } from "@/types/showtimes";

export const getShowTimeByMovieId = async (movieId: string, show_date: string): Promise<GetAllShowTimesResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllShowTimesResponse>(`/api/showtimes/movies/${movieId}`, {
        params: {
          show_date: show_date.trim()
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all showtime by movieId:", error);
      throw error;
    }
};

export const getAllShowTimes = async ({ user_id = "", accessToken = "", limit = 200, show_date = "" }): Promise<GetAllShowTimesResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllShowTimesResponse>(`/api/showtimes`, {
        params: {
          limit,
          show_date: show_date.trim()
        },
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all showtimes:", error);
      throw error;
    }
};

export const createShowTime = async (user_id: string, accessToken: string, newShowTime: ShowTimeRequestData): Promise<GetDetailesShowTimesResponse>  => {
  try {
      console.log("userid and acces", user_id, accessToken);
      const response = await axiosClientFe.post<GetDetailesShowTimesResponse>(`/api/showtimes`, newShowTime, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken
          }
      });
      console.log("response ", response)
      return response.data;  
  } catch (error) {
      console.error('Error create users:', error);
      throw error;  
  }
}

export const deleteShowTimes = async (user_id: string, accessToken: string, showtime_id: string) => {
  try {        
      const response = await axiosClientFe.delete(`/api/showtimes/${showtime_id}`, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken
          }
      });
      console.log("response ", response)
      return response;  
  } catch (error) {
      console.error('Error deleting users:', error);
      throw error;  
  }
}