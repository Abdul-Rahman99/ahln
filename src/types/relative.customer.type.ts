export interface RelativeCustomer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  customer_id: string;
  relation: string | null;
  email: string;
  mobile_number: string;
  box_id: string;
  is_active: boolean;
}
