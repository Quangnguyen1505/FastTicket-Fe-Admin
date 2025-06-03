export interface Revenue {
    total_revenue: number;
    total_booking: number;
    total_movie: number;
    total_user: number;
}

export interface AllRevenue {
    totalRevenue: number;
    totalRevenueByDate?: Record<string, number>;
}

export interface GetAllRevenueResponse {
    message: string;
    status: number;
    metadata: AllRevenue;
}

export interface EntityRevenue {
    entity_name: string;
    revenue: number;
    Room?: Room;
    Movie?: Movie;
}

export interface Room {
    id: string;
    movie_title: string;
}

export interface Movie {
    id: string;
    room_name: string;
}

export interface GetAllRevenueByEntityResponse {
    message: string;
    status: number;
    metadata: EntityRevenue[];
}

export interface RevenueDetails {
    entity: string;
    entity_id: string;
    groupBy: string;
    revenueByDate: Record<string, number>;
}

export interface GetAllRevenueDetailsResponse {
    message: string;
    status: number;
    metadata: RevenueDetails;
}