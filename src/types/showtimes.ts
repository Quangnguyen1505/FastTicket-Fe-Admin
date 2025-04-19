export interface ShowTimes {
    id: string; 
    show_date: string;
    start_time: string; 
    end_time: string; 
    movie_id: string; 
    room_id: string;
    status: string; 
    createdAt: Date; 
    updatedAt: Date; 
    Movie: {
        id: string,
        movie_title: string
    },
    Room: {
        id: string,
        room_name: string
    }
}

export interface GetAllShowTimesResponse {
    message: string;
    status: number;
    metadata: ShowTimes[];
}

export interface GetDetailesShowTimesResponse {
    message: string;
    status: number;
    metadata: ShowTimes;
}

export interface ShowTimeRequestData {
    show_date: string;
    start_time: string;
    end_time: string;
    movie_id: string;
    room_id: string;
    surcharge_seat: surchargeSeat[];
}

export interface surchargeSeat {
    name_type: string;
    surcharge: number;
}

export interface AddEventData {
    title: string;
    start: string;
    end: string;
    level: string;
}