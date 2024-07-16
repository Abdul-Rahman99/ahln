// systemLog
export interface SystemLog {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  error: string;
  source: string;
}
