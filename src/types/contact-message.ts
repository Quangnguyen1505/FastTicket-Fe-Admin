export interface ContactMessage{
    ID: string;
    Name: string;
    Email: string;
    Phone: string;
    Message: string;
    Status: number;
    CreatedAt: Date;
}
  
export interface GetAllContactMessageResponse {
    message: string;
    code: number;
    data: ContactMessage[];
}
  
export interface GetDetailsContactMessageResponse {
    message: string;
    code: number;
    data: ContactMessage;
}
  
export interface ContactMessageUploadFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface ContactMessageUpdateData {
    status: number;
}

export interface ResponseCustomer {
    name: string;
    email: string;
    message: string;
    response: string;
    contact_id: string;
}