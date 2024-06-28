export interface BoxLocker {
  id: string;
  locker_label: string;
  serial_port: string;
  createdAt: Date;
  updatedAt: Date;
  is_empty: boolean;
  box_id: string;
}
