export interface User {
    id: string; 
    usr_slug: string;
    usr_first_name: string; 
    usr_last_name: string; 
    usr_salf: number; 
    usr_email: string;
    usr_phone: number; 
    usr_sex: number; 
    usr_avatar_url: string; 
    usr_date_of_birth: Date; 
    usr_address: string; 
    usr_role_id: number; 
    usr_status: number; 
    createdAt: Date; 
    updatedAt: Date; 
    Role: { role_name: string };
}

export interface GetAllUserResponse {
    message: string;
    status: number;
    metadata: User[];
}

export interface UserRequestCreate {
    email: string;
    password: string;
}

export interface UserRequestUpdate {
    file: File | null;
    usr_avatar_url?: string;
    usr_first_name: string;
    usr_last_name: string;
    usr_password: string;
    usr_email: string;
    usr_phone: string;
    usr_sex: string;
    usr_date_of_birth: Date; 
    usr_address: string;
    role_name: string;
    usr_status: number; 
}

export interface CountUserResponse {
    message: string;
    status: number;
    metadata: number;
}
