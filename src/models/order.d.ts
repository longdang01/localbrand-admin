import { OrderDetailProps } from "./order-detail";

export type OrderProps = {
    _id: string;
    customer?: string;
    deliveryAddress?: string;
    ordersCode?: string;
    note: string;
    transportFee: number;
    total: number;
    status: number;
    payment: number;
    paid: number;
    orderDetails: OrderDetailProps[];
    active: number;
    createdAt: string;
    updatedAt: string;
}