type User = {
  id?: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  alt_phone?: string;
  payment_method?: string;
  box_info?: Record<string, any>;

  role: 'admin' | 'super admin' | 'customer' | 'delievry';
  createdAt: Date;
  updatedAt: Date;
};
export default User;
