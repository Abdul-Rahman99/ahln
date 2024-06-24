type TransporterType = 'amazon' | 'fedex' | 'talabat' | 'dhl' | 'alibaba' | 'other';
type Delivery = {
    id?: number;
    date_time: string;
    bar_code: string;
    qr_code: string;
    tracking_number: string;
    from_id: number;
    to_customer_id: number;
    delivered_date: string;
    delivered_status: boolean;
    transporter: TransporterType;
    transporter_name?: string;
    nickname?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
};
export default Delivery;
