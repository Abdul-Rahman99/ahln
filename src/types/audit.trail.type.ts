// User.ts
export interface Audit_Trail {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
  action: string;
}
