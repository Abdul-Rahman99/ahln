// User.ts
export interface AuditTrail {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  action: string;
  message: string;
  box_id: string | null;
}
