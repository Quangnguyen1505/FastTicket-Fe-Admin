import axiosClientFe from "@/helpers/call-fe";
import { GetAllRevenueResponse } from "@/types/revueue";
export const getAllRevenue = async (shopId: string, accessToken: string, params: URLSearchParams) => {
    const response = await axiosClientFe.get<GetAllRevenueResponse>("/api/revenue/summary", {
        headers: {
            "x-client-id": shopId,
            "authorization": accessToken
        },
        params: params
    });
    return response.data;
}

export const getRevenueByEntity = async (shopId: string, accessToken: string, params: URLSearchParams) => {
    const response = await axiosClientFe.get("/api/revenue/by-entity", {
        headers: {
            "x-client-id": shopId,
            "authorization": accessToken
        },
        params: params
    });
    return response.data;
}

export const getRevenueDetail = async (shopId: string, accessToken: string, params: URLSearchParams) => {
    const response = await axiosClientFe.get("/api/revenue/detail", {
        headers: {
            "x-client-id": shopId,
            "authorization": accessToken
        },
        params: params
    });
    return response.data;
}