// User.ts
export interface Notification {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  message: string;
  image: string | null;
  user: string;
}
