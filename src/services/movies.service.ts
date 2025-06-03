import axiosClientFe from "@/helpers/call-fe";
import { GetAllMoviesResponse, GetMovieResponse } from "@/types/movies";


export const getAllMovies = async ({
    limit = 50,
    page = 1,
    movie_status = "",
    search = "",
}): Promise<GetAllMoviesResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllMoviesResponse>(`/api/movies`, {
        params: {
          limit,
          page,
          movie_status,
          search,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw error;
    }
};

export const createMovies = async (user_id: string, accessToken: string, newMovies: FormData) => {
  try {
      const response = await axiosClientFe.post<GetMovieResponse>(`/api/movies`, newMovies, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken,
              'Content-Type': 'multipart/form-data' 
          }
      });
      console.log("response ", response);
      return response.data;  
  } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;  
  }
};


export const updateMovies = async (user_id: string, accessToken: string, movieId: string, editMovies: FormData) => {
  try {
      const response = await axiosClientFe.put(`/api/movies/${movieId}`, editMovies, {
          headers: {
              'x-client-id': user_id,
              'authorization': accessToken,
              'Content-Type': 'multipart/form-data' 
          }
      });
      console.log("response ", response)
      return response;  
  } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;  
  }
}

export const deleteMovies = async (user_id: string, accessToken: string, movieId: string) => {
  try {        
      const response = await axiosClientFe.delete(`/api/movies/${movieId}`, {
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