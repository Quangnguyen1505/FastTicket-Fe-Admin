import axiosClientFe from "@/helpers/call-fe";
import { CategoryRequestCreate, GetAllCategoryResponse } from "@/types/categories";

export const getAllCategory = async (): Promise<GetAllCategoryResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllCategoryResponse>(`/api/movies/category`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw error;
    }
};

export const createCategories = async (user_id: string, accessToken: string, newCate: CategoryRequestCreate) => {
    try {
        console.log("userid and acces", user_id, accessToken);
        
        const response = await axiosClientFe.post(`/api/movies/category`, newCate, {
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

export const updateCategories = async (user_id: string, accessToken: string, categoryId: string, editCate: CategoryRequestCreate) => {
    try {
        const response = await axiosClientFe.put(`/api/movies/category/${categoryId}`, editCate, {
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

export const deleteCategories = async (user_id: string, accessToken: string, categoryId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/movies/category/${categoryId}`, {
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
