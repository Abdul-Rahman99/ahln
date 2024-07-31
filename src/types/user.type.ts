// User.ts
export interface User {
  title: string;
  id: string;
  user_name: string;
  createdAt: Date;
  updatedAt: Date;
  role_id: number;
  is_active: boolean;
  phone_number: string;
  email: string;
  password: string;
  preferred_language?: string;
  register_otp?: string | null;
  email_verified?: boolean;
  token?: string | null;
  country?: string | null;
  city?: string | null;
  avatar?: string | null;
}
