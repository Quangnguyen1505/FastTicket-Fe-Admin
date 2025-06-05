import axiosClientFe from "@/helpers/call-fe";
import { SnackResponseAll } from "@/types/snack";

export const getAllSnack = async (user_id: string, accessToken: string): Promise<SnackResponseAll> => {
    try {
      const response = await axiosClientFe.get<SnackResponseAll>(`/api/snack`,{
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all snack:", error);
      throw error;
    }
};

export const addSnack = async (user_id: string, accessToken: string, newSnack: FormData) => {
    try {
        console.log("userid and acces", user_id, accessToken);
        const response = await axiosClientFe.post(`/api/snack`, newSnack, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error create snack:', error);
        throw error;  
    }
}

export const deleteSnacks = async (user_id: string, accessToken: string, snackId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/snack/${snackId}`, {
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

export const updateSnack = async (user_id: string, accessToken: string, snackId: string, editSnack: FormData) => {
    try {
        const response = await axiosClientFe.put(`/api/snack/${snackId}`, editSnack, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken,
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error update snack:', error);
        throw error;  
    }
}