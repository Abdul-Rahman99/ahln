// User.ts
export interface User {
  id: string;
  user_name: string;
  role_id: number;
  createdAt: Date;
  updatedAt: Date;
  is_active: boolean;
  phone_number: string;
  email: string;
  password: string;
  preferred_language?: string;
  register_otp?: string | null;
  email_verified?: boolean;
}
