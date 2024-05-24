import { ProductProps } from "./product";
import { ProductColorsProps } from "./product-color";
import { ProductSizeProps } from "./product-size";

export type OrderDetailProps = {
    _id: string;
    orders: string;
    product: ProductProps | string;
    color: ProductColorsProps | string;
    size: ProductSizeProps | string;
    price: number;
    quantity: number;
    active: number;
    createdAt: string;
    updatedAt: string;
}