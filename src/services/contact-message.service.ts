import axiosClientFe from "@/helpers/call-fe";
import { ContactMessageUploadFormData, GetAllContactMessageResponse, GetDetailsContactMessageResponse } from "@/types/contact-message";

export const getAllContactMessage = async ({
    limit = 50, 
    page = 1, 
    status = null
}, user_id: string, accessToken: string ): Promise<GetAllContactMessageResponse> => {
    try {
      const response = await axiosClientFe.get<GetAllContactMessageResponse>(`/api/contact-message`, {
        params: {
            limit,
            page,
            status
        },
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all Contact Message:", error);
      throw error;
    }
};

export const getDetailContactMessage = async (contactMessageId: string): Promise<GetDetailsContactMessageResponse> => {
    try {
      const response = await axiosClientFe.get<GetDetailsContactMessageResponse>(`/api/contact-message/${contactMessageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Contact Message:", error);
      throw error;
    }
};

export const createContactMessage = async (newContactMess: ContactMessageUploadFormData) => {
    try {        
        const response = await axiosClientFe.post(`/api/contact-message`, newContactMess);
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error create Contact Message:', error);
        throw error;  
    }
}

export const updateContactMessage = async (user_id: string, accessToken: string, contactMessageId: string, editContactMess: ContactMessageUploadFormData) => {
    try {
        const response = await axiosClientFe.put(`/api/contact-message/${contactMessageId}`, editContactMess, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error update Contact Message:', error);
        throw error;  
    }
}

export const deleteContactMessage = async (user_id: string, accessToken: string, contactMessageId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/contact-message/${contactMessageId}`, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error deleting Contact Message:', error);
        throw error;  
    }
}
