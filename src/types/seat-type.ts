export interface SeatType {
    id: string;
    name: string;
    description: string;
}

export interface GetAllSeatTypesResponse {
    message: string;
    status: number;
    metadata: SeatType[];
}

export interface SeatTypeRequestEdit {
    id: string;
    name: string;
    description: string;
}

export interface SeatTypeRequestCreate {
    name: string;
    description: string;
}