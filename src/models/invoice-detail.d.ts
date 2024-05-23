import { ProductProps } from "./product";
import { ProductColorsProps } from "./product-color";
import { ProductSizeProps } from "./product-size";

export type InvoiceDetailProps = {
    _id: string;
    invoice: string;
    product: ProductProps | string;
    color: ProductColorsProps | string;
    size: ProductSizeProps | string;
    priceImport: number;
    quantity: number;
    active: number;
    createdAt: string;
    updatedAt: string;
}