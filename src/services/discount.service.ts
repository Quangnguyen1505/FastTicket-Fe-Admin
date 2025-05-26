import axiosClientFe from "@/helpers/call-fe";
import { DiscountRequestPayload, DiscountRequestUpdate, DiscountResponseAll, DiscountResponseDetailData } from "@/types/discount";

export const getAllDiscount = async (user_id: string, accessToken: string): Promise<DiscountResponseAll> => {
    try {
      const response = await axiosClientFe.get<DiscountResponseAll>(`/api/discount`,{
        headers: {
            'x-client-id': user_id,
            'authorization': accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all discount:", error);
      throw error;
    }
};

export const addDiscount = async (user_id: string, accessToken: string, newDiscount: DiscountRequestPayload) => {
    try {
        const response = await axiosClientFe.post(`/api/discount`, newDiscount, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error create discount:', error);
        throw error;  
    }
}

export const deleteDiscount = async (user_id: string, accessToken: string, discountId: string) => {
    try {        
        const response = await axiosClientFe.delete(`/api/discount/${discountId}`, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error deleting discount:', error);
        throw error;  
    }
}

export const updateDiscount = async (user_id: string, accessToken: string, discountId: string, editDiscount: DiscountRequestUpdate): Promise<DiscountResponseDetailData> => {
    try {
        const response = await axiosClientFe.put<DiscountResponseDetailData>(`/api/discount/${discountId}`, editDiscount, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response.data;  
    } catch (error) {
        console.error('Error updating discount:', error);
        throw error;  
    }
}   