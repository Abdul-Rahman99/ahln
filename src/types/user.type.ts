type User = {
  id?: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  alt_phone?: string;
  payment_method?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  box_info?: Record<string, any>;

  role: 'admin' | 'super admin' | 'customer' | 'vendor' | 'operations';
  createdAt: Date;
  updatedAt: Date;
  gr?: string;
};
export default User;
