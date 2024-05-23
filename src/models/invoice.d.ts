import { InvoiceDetailProps } from "./invoice-detail";

export type InvoiceProps = {
    _id: string;
    staff: string;
    invoiceCode: string;
    note: string;
    transportFee: number;
    total: number;
    paid: number;
    invoiceDetails: InvoiceDetailProps[];
    active: number;
    createdAt: string;
    updatedAt: string;
}