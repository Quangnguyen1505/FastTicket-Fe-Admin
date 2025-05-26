export interface Snack {
    id: string;
    item_name: string;
    item_price: number;
    item_image_url: string;
    quantity_available: string;
    category: string;
}

export interface SnackRequestCreate {
    item_name: string;
    item_price: number;
    file: File | null;
    quantity_available: number;
    category: 0 | 1 | null;
}

export interface SnackRequestUpdate {
    item_name?: string;
    item_price?: number;
    file?: File | null;
    quantity_available?: number;
    category?: 0 | 1 | null;
}

export interface SnackData {
    snack: Snack;
}

export interface SnackDataAll {
    snacks: Snack[];
}

export interface SnackResponseCreate {
    message: string;
    status: number;
    metadata: SnackData;
}

export interface SnackResponseAll {
    message: string;
    status: number;
    metadata: SnackDataAll;
}


