export interface DeliveryPackage {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    customer_id: string;
    vendor_id: string;
    delivery_id: string;
    tracking_number: string;
    address_id: number;
    shipping_company_id: number;
    box_id: string;
    box_locker_id: string;
    shipment_status: string;
    is_delivered: boolean;
    box_locker_string: string;
}
