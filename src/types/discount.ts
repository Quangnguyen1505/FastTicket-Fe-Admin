export interface Discount {
    id: string;
    discount_name: string;
    discount_description: number;
    discount_code: string;
    discount_value: string;
    discount_type: string;
    discount_start_date: Date;
    discount_end_date: Date;
    discount_max_uses: number;
    discount_min_booking_amount: number;
    discount_used_count: number;
    discount_is_active: boolean;
    movie_ids: string[];
}

export interface DiscountRequestCreate {
    discount_name: string;
    discount_description: string;
    discount_code: string;
    discount_value: number;
    discount_type: 'PERCENTAGE' | 'AMOUNT';
    discount_start_date: string;
    discount_end_date: string;
    discount_max_uses: number;
    discount_min_booking_amount: number;
    discount_is_active: boolean;
    movie_ids: string[];
}

export enum DiscountTypeEnum {
  PERCENTAGE = 0,
  AMOUNT = 1,
}

export interface DiscountRequestPayload {
  discount_name: string;
  discount_description: string;
  discount_code: string;
  discount_value: number;
  discount_type: DiscountTypeEnum;  // số, đúng với protobuf
  discount_start_date: string;
  discount_end_date: string;
  discount_max_uses: number;
  discount_min_booking_amount: number;
  discount_is_active: boolean;
  movie_ids: string[];
}

export interface DiscountRequestUpdate {
    discount_name?: string;
    discount_description?: string;
    discount_code?: string;
    discount_value?: number;
    discount_type?: DiscountTypeEnum;
    discount_start_date?: string;
    discount_end_date?: string;
    discount_max_uses?: number;
    discount_min_booking_amount?: number;
    discount_is_active?: boolean;
    movie_ids?: string[];
}

export interface DiscountResponseCreate {
    message: string;
    status: number;
    metadata: Discount;
}

export interface DiscountAll {
    discounts: Discount[]
}

export interface DiscountResponseAll {
    message: string;
    status: number;
    metadata: DiscountAll;
}

export interface DiscountResponseDetailData {
    message: string;
    status: number;
    metadata: Discount;
}


