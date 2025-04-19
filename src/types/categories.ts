export interface Category {
    id: string;
    cate_name: string;
    cate_slug: string;
    cate_description: string;
    createdAt: string;
    updatedAt: number;
}

export interface GetAllCategoryResponse {
    message: string;
    status: number;
    metadata: Category[];
}

export interface CategoryRequestEdit {
    id: string;
    cate_name: string;
    cate_description: string;
}

export interface CategoryRequestCreate {
    cate_name: string;
    cate_description: string;
}