export interface BoxLocker {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  locker_label: string;
  serial_port: string;
  is_empty: boolean;
  box_id: string;
}
