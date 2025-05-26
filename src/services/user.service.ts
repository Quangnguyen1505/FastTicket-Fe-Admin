import axiosClientFe from "@/helpers/call-fe";
import { CountUserResponse, GetAllUserResponse, UserRequestCreate } from "@/types/users";

export const getAllUsers = async ({
    user_id = "",
    accessToken = "",
    limit = 50,
    page = 1,
}): Promise<GetAllUserResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllUserResponse>(`/api/users/admin`,{
        params: {
          limit,
          page,
        },
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
};

export const addUsers = async (user_id: string, accessToken: string, newUsers: UserRequestCreate) => {
    try {
        console.log("userid and acces", user_id, accessToken);
        const response = await axiosClientFe.post(`/api/users/admin`, newUsers, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error create users:', error);
        throw error;  
    }
}

export const updateUsers = async (user_id: string, accessToken: string, userId: string, editUser: FormData) => {
    try {
        const response = await axiosClientFe.put(`/api/users/admin/${userId}`, editUser, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken,
                'Content-Type': 'multipart/form-data' 
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error update users:', error);
        throw error;  
    }
}

export const deleteUsers = async (user_id: string, accessToken: string, userId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/users/admin/${userId}`, {
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

export const getCountUser = async (user_id: string, accessToken: string) => {
    try {
        const response = await axiosClientFe.get<CountUserResponse>("/api/users/admin/count", {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching count users:', error);
        throw error;
    }
}
