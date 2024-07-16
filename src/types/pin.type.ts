export interface PIN {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  reciepent_email?: string;
  title: string;
  is_active: boolean;
  time_range: string;
  day_range: string;
  box_id: string;
  user_id: string;
  type: string;
  passcode: string;
}
