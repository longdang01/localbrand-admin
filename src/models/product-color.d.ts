import { ProductSizeProps } from "./product-size";

export type ProductColorsProps = {
    _id?: string;
    product?: string;
    colorName?: string;
    hex?: string;
    price?: number;
    priceImport?: number;
    sizes?: ProductSizeProps[];
    images?: ProductSizeProps[]; 

    active?: number;
    createdAt?: string;
    updatedAt?: string;
}