export interface SalesInvoice {
    id: string;
    customer_id: string;
    box_id: string;
    purchase_date: Date;
    createdAt: any;
    updatedAt: any;
    sales_id: string;
}
export interface SalesInvoicePayload {
    id: string;
    customer_id: string;
    box_id: string;
    purchase_date: string;
    createdAt: Date;
    updatedAt: Date;
    sales_id: string;
}
