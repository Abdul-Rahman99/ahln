export interface Payment {
    id?: number;
    amount: number;
    card_id: number;
    createdAt?: Date;
    updatedAt?: Date;
    billing_date: Date | string;
    is_paid?: boolean;
    customer_id: string;
    sales_id: string;
}
