// User.ts
export interface User {
  id: string;
  role_id: number;
  fcm_token: string;
  createdAt: Date;
  updatedAt: Date;
  is_active: boolean;
  phone_number: string;
  email: string;
  password: string;
  prefered_language?: string;
}
