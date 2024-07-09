export interface ContactUs {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  mobile_number: string | null;
  message: string;
  created_by: string | null;
}
