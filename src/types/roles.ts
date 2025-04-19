export interface Role {
    id: string;
    role_name: string;
    role_slug: string;
    role_status: string;
    role_description: string;
}

export interface GetAllRolesResponse {
    message: string;
    status: number;
    metadata: Role[];
}

export interface RolesRequestCreate {
    role_name: string;
    role_status: string;
    role_description: string;
}