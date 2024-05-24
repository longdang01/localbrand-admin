import { OrderDetailProps } from "@/models/order-detail";
import { create } from "zustand";

interface OrderDetailState {
    orderDetails: OrderDetailProps[];
    setOrderDetails: (orderDetails: OrderDetailProps[]) => void;
}

export const useOrderDetailState = create<OrderDetailState>()((set) => ({
    orderDetails: [],
    setOrderDetails: (orderDetails) => set({ orderDetails }),
}));