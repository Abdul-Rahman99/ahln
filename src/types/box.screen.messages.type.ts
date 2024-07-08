export interface BoxScreenMessage {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  box_id: string;
  user_id: string;
  tablet_id: number;
  title: string;
  message: string;
}
