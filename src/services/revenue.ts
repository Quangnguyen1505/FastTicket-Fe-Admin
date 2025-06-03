import axiosClientFe from "@/helpers/call-fe";
import { GetAllRevenueByEntityResponse, GetAllRevenueDetailsResponse, GetAllRevenueResponse } from "@/types/revueue";
export const getAllRevenue = async (shopId: string, accessToken: string, params: URLSearchParams): Promise<GetAllRevenueResponse> => {
    const response = await axiosClientFe.get<GetAllRevenueResponse>("/api/revenue/summary", {
        headers: {
            "x-client-id": shopId,
            "authorization": accessToken
        },
        params: params
    });
    return response.data;
}

export const getRevenueByEntity = async (shopId: string, accessToken: string, params: URLSearchParams): Promise<GetAllRevenueByEntityResponse> => {
    const response = await axiosClientFe.get<GetAllRevenueByEntityResponse>("/api/revenue/by-entity", {
        headers: {
            "x-client-id": shopId,
            "authorization": accessToken
        },
        params: params
    });
    return response.data;
}

export const getRevenueDetail = async (shopId: string, accessToken: string, params: URLSearchParams): Promise<GetAllRevenueDetailsResponse> => {
    const response = await axiosClientFe.get<GetAllRevenueDetailsResponse>("/api/revenue/detail", {
        headers: {
            "x-client-id": shopId,
            "authorization": accessToken
        },
        params: params
    });
    return response.data;
}