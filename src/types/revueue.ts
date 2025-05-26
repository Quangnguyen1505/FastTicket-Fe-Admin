export interface Revenue {
    total_revenue: number;
    total_booking: number;
    total_movie: number;
    total_user: number;
}

export interface AllRevenue {
    totalRevenue: number;
}

export interface GetAllRevenueResponse {
    message: string;
    status: number;
    metadata: AllRevenue;
}