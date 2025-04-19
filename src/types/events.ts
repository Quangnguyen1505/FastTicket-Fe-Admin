export interface Event{
  ID: string;
  EventName: string;
  EventDescription: string;
  EventImageUrl: string;
  EventStart: string;
  EventEnd: string;
  EventActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface GetAllEventsResponse {
    message: string;
    code: number;
    data: Event[];
}

export interface GetDetailsEventResponse {
  message: string;
  code: number;
  data: Event;
}

export interface EventsUploadFormData {
  file: File | null;
  image?: string;
  name: string;
  end: Date;
  start: Date;
  active: boolean;
  description: string;
}
  
export interface EventsUploadFormDataTime {
  file: File | null;
  image?: string;
  name: string;
  end: string;
  start: string;
  active: boolean;
  description: string;
}