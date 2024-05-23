import { InvoiceDetailProps } from "@/models/invoice-detail";
import { create } from "zustand";

interface InvoiceDetailState {
    invoiceDetails: InvoiceDetailProps[];
    setInvoiceDetails: (invoiceDetails: InvoiceDetailProps[]) => void;
}

export const useInvoiceDetailState = create<InvoiceDetailState>()((set) => ({
    invoiceDetails: [],
    setInvoiceDetails: (invoiceDetails) => set({ invoiceDetails }),
}));