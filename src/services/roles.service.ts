import axiosClientFe from "@/helpers/call-fe";
import { GetAllRolesResponse, RolesRequestCreate } from "@/types/roles";

export const getAllRoles = async (user_id: string, accessToken: string): Promise<GetAllRolesResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllRolesResponse>(`/api/users/roles`, {
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all roles:", error);
      throw error;
    }
};

export const createRoles = async (user_id: string, accessToken: string, newRole: RolesRequestCreate) => {
    try {
        console.log("userid and acces", user_id, accessToken);
    
        const response = await axiosClientFe.post(`/api/users/roles`, newRole, {
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

export const updateRoles = async (user_id: string, accessToken: string, roleId: string, editRole: RolesRequestCreate) => {
    try {
        const response = await axiosClientFe.put(`/api/users/roles/${roleId}`, editRole, {
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

export const deleteRoles = async (user_id: string, accessToken: string, roleId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/users/roles/${roleId}`, {
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
