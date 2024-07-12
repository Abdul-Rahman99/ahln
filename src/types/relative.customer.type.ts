export interface RelativeCustomer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  customer_id: string;
  relative_customer_id: string;
  relation: string | null;
  is_active: boolean;
  box_id: string;
}
