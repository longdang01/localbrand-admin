import { ProductSizeProps } from "./product-size";

export type ProductDiscountProps = {
    _id?: string;
    color?: string;
    discountName?: string;
    symbol?: number;
    value?: number;

    active?: number;
    createdAt?: string;
    updatedAt?: string;
}